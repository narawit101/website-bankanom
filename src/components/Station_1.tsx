
import React, { useEffect } from 'react'
import { useState } from 'react'
import product from '../data/mock-product.json';
import production from '../data/mock-production.json'

function Station_1() {
    console.log('Product Data:', product);
    console.log('Production Data:', production);
    const allProducts: any = product;
    const allProduction: any = production;

    const station1 = allProduction.data.filter(
        (item: any) => item.station === 1
    )

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [problemProduct, setProblemProduct] = useState<any>(null);
    const [trayInput, setTrayInput] = useState<{ [key: number]: number }>({});
    const [problemQty, setProblemQty] = useState<number>(0);
    const [problemTitle, setProblemTitle] = useState<string>("");
    const [filterProduct, setFilterProduct] = useState<string>("");
    const [filterFactory, setFilterFactory] = useState<string>("");
    const [filterStatus, setFilterStatus] = useState<string>("");
    const [filterDate, setFilterDate] = useState<string>("");
    const [filterShipping, setFilterShipping] = useState<string>("");

    const checkStatus = (item: any, status: string) => {
        const total = item.import_quantity;
        const used = Number(item.export_quantity) + Number(item.lost_quantity);
        const left = total - used;

        if (status === "finished") return left === 0;
        if (status === "left") return left > 0;
        if (status === "lost") return item.lost_quantity > 0;

        return true;
    };

    const filteredStation = station1.filter((item: any) => {
        return (
            (filterProduct ? item.product_id == filterProduct : true) &&
            (filterFactory ? item.factory_id == filterFactory : true) &&
            (filterStatus ? checkStatus(item, filterStatus) : true) &&
            (filterDate ? item.CreatedAt?.split("T")[0] === filterDate : true) &&
            (filterShipping ? item.shipping_time === filterShipping : true)
        );
    });

    const handleSendProduct = (item: any, tray: number, trayPerUnit: number) => {
        const matchProduct = allProducts.products.find((prod: any) => prod.id === item.product_id);
        const total = item.import_quantity;
        const sumExport = Number(item.export_quantity) + Number(item.lost_quantity);
        const left = total - sumExport;
        const maxTray = Math.floor(left / trayPerUnit);

        if (!tray) {
            alert("กรุณากรอกจำนวนถาดที่จะส่ง");
            return;
        }
        if (tray > maxTray || tray < 0) {
            alert("จำนวนไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง");
            return;
        }

        const sendQty = tray * trayPerUnit;

        alert(`
ส่งสินค้าเรียบร้อย
สินค้า: ${matchProduct.name}
เวลาส่ง: ${item.shipping_time}
โรงงาน: ${item.factory_id}
จำนวนถาดที่ส่ง: ${tray}
จำนวนชิ้นที่ส่ง: ${sendQty}
สถานี: ${item.station}
เวลาที่ส่ง: ${new Date().toLocaleString()}
        `);
    };

    const handleOpenProblem = (item: any) => {
        setProblemProduct(item);
        setOpenModal(true);
    };

    const handleSubmitProblem = () => {
        if (!problemTitle) {
            alert("กรุณาเลือกหัวข้อปัญหา");
            return;
        }
        if (!problemQty || problemQty <= 0) {
            alert("กรุณากรอกจำนวนชิ้นที่มีปัญหา");
            return;
        }

        const matchProduct = allProducts.products.find((prod: any) => prod.id === problemProduct.product_id);

        alert(`
สินค้า: ${matchProduct.name}
เวลาส่ง: ${problemProduct.shipping_time}
โรงงาน: ${problemProduct.factory_id}
หัวข้อปัญหา: ${problemTitle}
จำนวนชิ้นที่มีปัญหา: ${problemQty}
สถานี: ${problemProduct.station}
เวลาที่แจ้ง: ${new Date().toLocaleString()}
        `);

        setOpenModal(false);
        setProblemQty(0);
        setProblemTitle("");
    };
    return (

        <div className='flex flex-col gap-4 justify-center w-full text-black'>
            <div className="w-full bg-white p-4 rounded-lg shadow mb-6">

                <h2 className="text-lg font-bold mb-4">ค้นหา / กรองข้อมูล</h2>

                <div className="grid grid-cols-2 gap-4">

                    <select
                        className="border p-2 rounded"
                        value={filterProduct}
                        onChange={(e) => setFilterProduct(e.target.value)}
                    >
                        <option value="">สินค้า (ทั้งหมด)</option>
                        {allProducts.products.map((p: any) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>

                    <select
                        className="border p-2 rounded"
                        value={filterFactory}
                        onChange={(e) => setFilterFactory(e.target.value)}
                    >
                        <option value="">โรงงานทั้งหมด</option>
                        <option value="1">โรงงาน 1</option>
                        <option value="2">โรงงาน 2</option>
                    </select>

                    <select
                        className="border p-2 rounded"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="">สถานะทั้งหมด</option>
                        <option value="finished">ผลิตครบแล้ว</option>
                        <option value="left">มีของเหลือ</option>
                        <option value="lost">มีของเสีย</option>
                    </select>

                    <input
                        type="date"
                        className="border p-2 rounded"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                    />

                    <input
                        type="time"
                        className="border p-2 rounded"
                        value={filterShipping}
                        onChange={(e) => setFilterShipping(e.target.value)}
                    />
                </div>
            </div>

            <div className='text-gray-700 w-full'>
                {station1.length > 0 &&
                    (
                        <div>
                            {filteredStation.map((item: any) => {
                                // console.log('Product Item:', item);
                                const matchProduct = allProducts.products.find((prod: any) => prod.id === item.product_id);
                                const trayPerUnit = matchProduct?.piece_per_tray || 1;
                                // console.log('Matched Product for Production ID', item.ID, ':', matchProduct);
                                const tray = matchProduct ? matchProduct.piece_per_tray : 0;
                                console.log('Tray for Production ID', item.ID, ':', tray);
                                const total = item.import_quantity;
                                const sumExport = Number(item.export_quantity) + Number(item.lost_quantity);
                                const left = total - sumExport;
                                const leftTray = Math.floor(left / trayPerUnit);
                                const allTray = Math.floor(total / trayPerUnit);
                                const nameProduct = matchProduct ? matchProduct.name : 'Unknown';

                                return (
                                    <div key={item.id} className="mb-4 p-4 border border-gray-300 rounded-lg shadow-sm ">
                                        <h2 className="text-lg font-semibold mb-2">Productions ID: {item.ID}</h2>

                                        <p>ชื่อสินค้า {nameProduct}</p>
                                        <p>เวลาส่ง {item.shipping_time}</p>
                                        <p>โรงงานผลิต {item.factory_id}</p>
                                        <p>จำนวนชิ้นที่ผลิต {total}</p>
                                        <p>จำนวนที่ผลิตได้ {item.export_quantity}</p>
                                        <p>จำนวนทีเสีย {item.lost_quantity}</p>
                                        <p>จำนวนที่เหลือ {left}</p>
                                        <p>จำนวนออกรวม {sumExport}</p>
                                        <p>stations {item.station}</p>
                                        <p>ถาดทั้งหมด: {allTray}</p>
                                        <p>ถาดที่เหลือ: {leftTray}</p>
                                        <div className="flex flex-col items-end gap-3">
                                            <input
                                                type="number"
                                                min={0}
                                                value={trayInput[item.ID] || ""}
                                                onChange={(e) =>
                                                    setTrayInput({ ...trayInput, [item.ID]: Number(e.target.value) })
                                                }
                                                className="border p-2 rounded-md w-32"
                                                placeholder="จำนวนถาด"
                                            />


                                            <button
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-32"
                                                onClick={() =>
                                                    handleSendProduct(item, trayInput[item.ID], trayPerUnit)
                                                }
                                            >
                                                ส่งสินค้า
                                            </button>

                                            <button
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md w-32"
                                                onClick={() => handleOpenProblem(item)}
                                            >
                                                แจ้งปัญหา
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}

                        </div>

                    )}

            </div>
            {openModal && (
                <div className="fixed inset-0 bg-opacity-40 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-black">

                        <h2 className="text-xl font-bold mb-4 text-red-600">แจ้งปัญหา</h2>

                        <label className="flex text-sm mt-4 mb-4">หัวข้อปัญหา</label>
                        <select
                            value={problemTitle}
                            onChange={(e) => setProblemTitle(e.target.value)}
                            className="border w-full p-2 rounded mb-3"
                        >
                            <option value="">-- เลือกหัวข้อปัญหา --</option>
                            <option value="วัตถุดิบหมด">วัตถุดิบหมด</option>
                            <option value="เครื่องเสีย">เครื่องเสีย</option>
                            <option value="ไหม้">ไหม้</option>
                        </select>

                        <label className="flex text-sm mt-4 mb-4">จำนวนชิ้นที่มีปัญหา</label>
                        <input
                            type="number"
                            min={0}
                            value={problemQty}
                            onChange={(e) => setProblemQty(Number(e.target.value))}
                            className="border p-2 rounded w-full mb-4"
                        />

                        <div className="flex justify-between mt-4">
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded"
                                onClick={handleSubmitProblem}
                            >
                                แจ้งปัญหา
                            </button>

                            <button
                                className="bg-gray-400 text-white px-4 py-2 rounded"
                                onClick={() => setOpenModal(false)}
                            >
                                ปิด
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Station_1