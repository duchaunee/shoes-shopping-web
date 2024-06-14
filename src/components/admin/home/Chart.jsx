import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { toast } from "react-toastify";
import { collection, getDocs, query, where } from "@firebase/firestore";
import { db } from "../../../firebase/config";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "right",
    },
  },
};

const labels = [
  "Đang xử lý (Đơn)",
  "Vận chuyển (Đơn)",
  "Đang giao (Đơn)",
  "Hoàn thành (Đơn)",
  " Doanh thu (Đơn vị: triệu)",
];

const Chart = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [date, setDate] = useState({
    from: null,
    to: null,
  });
  const [data, setData] = useState(null);

  //nguyên nhân phải truyền allOrders vào đây vì ở hàm
  //getStatisticByDate, sau khi get được allOrders thì hàm setOrder nó là
  //bất đòng bộ mà, vậy nên hàm countProcessingOrders sẽ bị chạy trước, nếu không truyền
  //allOrders vào thì nó sẽ lấy allOrders ở giá trị khởi tạo là [] (rỗng)
  const countProcessingOrders = (status, allOrders) => {
    console.log(
      allOrders.reduce(
        (count, order) => (order.orderStatus === status ? ++count : count),
        0
      )
    );
    return allOrders.reduce(
      (count, order) => (order.orderStatus === status ? ++count : count),
      0
    );
  };

  // lấy ra thống kê (số đơn hàng + tổng doanh thu)
  const getStatisticByDate = async () => {
    const fromDate = date.from ? new Date(date.from) : new Date("1970-01-01");
    const toDate = date.to ? new Date(date.to) : new Date("2030-01-01");

    // const ordersRef = query(collection(db, "orders"),
    //   where('creatAt', ">=", fromDate),
    //   where('creatAt', "<=", toDate));
    const ordersRef = query(collection(db, "orders"));
    const q = query(ordersRef);
    try {
      const querySnapshot = await getDocs(q);
      const allOrders = querySnapshot.docs
        .map((doc) => {
          if (doc.data().orderStatus !== "Đã hủy")
            return {
              id: doc.id,
              ...doc.data(),
            };
        })
        .filter(
          (order) =>
            order && //lọc ra những thằng undefined
            new Date(order.creatAt) >= fromDate &&
            new Date(order.creatAt) <= toDate
        );
      console.log("allOrders: ", allOrders);
      const total = allOrders.reduce((total, item) => {
        let tmpPrice;
        if (item.orderStatus === "Đã hủy") tmpPrice = 0;
        else
          tmpPrice =
            item.cartProduct.price * item.cartProduct.quantity +
            item.deliveryFee -
            item.discount;
        return total + tmpPrice;
      }, 0);
      setAllOrders(allOrders);
      setTotal(total);
      setData({
        labels,
        datasets: [
          {
            label: "Tổng thống kê",
            data: [
              countProcessingOrders("Đang xử lý", allOrders),
              countProcessingOrders("Vận chuyển", allOrders),
              countProcessingOrders("Đang giao", allOrders),
              countProcessingOrders("Hoàn thành", allOrders),
              total / 1000000,
            ],
            backgroundColor: "rgba(53, 162, 235, 0.5)",
          },
        ],
      });
    } catch (e) {
      console.log(e.message);
    }
  };

  const solveDate = (e) => {
    setDate({
      ...date,
      [e.target.name]: e.target.value,
    });
  };

  const submitDate = () => {
    if (date.from === null || date.to === null) {
      toast.error("Vui lòng chọn ngày thống kê", {
        autoClose: 1200,
      });
    } else if (new Date(date.from) > new Date(date.to)) {
      toast.error("Ngày sau không được nhỏ hơn ngày trước", {
        autoClose: 1200,
      });
    } else {
      getStatisticByDate();
    }
  };

  useEffect(() => {
    getStatisticByDate();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex gap-6 items-center justify-center">
          <div className="relative">
            <label
              htmlFor="from"
              className="absolute top-0 translate-y-[-50%] left-[10px] bg-white px-2 text-[14px]"
            >
              Từ ngày
            </label>
            <input
              onChange={solveDate}
              id="from"
              name="from"
              type="date"
              className="border border-[#999] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
            />
          </div>
          <div className="relative">
            <label
              htmlFor="to"
              className="absolute top-0 translate-y-[-50%] left-[10px] bg-white px-2 text-[14px]"
            >
              Đến ngày
            </label>
            <input
              onChange={solveDate}
              id="to"
              name="to"
              type="date"
              className="border border-[#999] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
            />
          </div>
          <button
            onClick={submitDate}
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none  focus:ring-blue-300 active:scale-95 font-medium text-sm px-3 py-2 text-center ml-2 select-none"
          >
            Thống kê
          </button>
        </div>
        {data && <Bar options={options} data={data} />}
      </div>
    </>
  );
};

export default Chart;
