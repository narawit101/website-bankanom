
import React, { useEffect } from 'react'
import { useState } from 'react'
import product from '../data/mock-product.json';
import production from '../data/mock-production.json'

function Station_3() {
  console.log('Product Data:', product);
  console.log('Production Data:', production);
  const allProducts: any = product;
  const allProduction: any = production;
  const [products, setProducts] = useState([])
  const [productions, setProductions] = useState([])

  useEffect(() => {
    fetachProducts(products);
    fetachProduction(productions);
    // console.log('Products:', products);
    // console.log('Production:', productions);
  }, [products, productions]);

  const fetachProducts = async (data: any) => {
    try {
      if (data) {
        setProducts(data);
        console.log('Fetched Products:', data);
      }
    } catch (error) {
      console.log('Error fetching products:', error);
    }
  }
  const fetachProduction = async (data: any) => {
    try {
      if (data) {
        setProductions(data);
      }
    } catch (error) {
      console.log('Error fetching production:', error);
    }
  }

  console.log('Rendered Products:', allProducts);
  console.log('Rendered Products:', allProduction);
  const station3 = allProduction.data.filter(
    (item: any) => item.station === 3
  )
  return (

    <div className='flex flex-row gap-4 justify-center w-full'>
      {/* <div className='text-gray-700'>
                {allProducts.products.length > 0 && (
                    <div>
                        {allProducts.products.map((item: any) => {
                            // console.log('Product Item:', item);
                            return (
                                <div key={item.id} className="mb-4 p-4 border border-gray-300 rounded-lg shadow-sm">
                                    <h2 className="text-lg font-semibold mb-2">Product ID {item.id}</h2>
                                    <p className="text-lg font-semibold mb-2">Product Name: {item.name}</p>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div> */}
      <div className='text-gray-700 '>
        {station3.length > 0 &&
          (
            <div>
              {station3.map((item: any) => {
                // console.log('Product Item:', item);
                const matchProduct = allProducts.products.find((prod: any) => prod.id === item.product_id);
                // console.log('Matched Product for Production ID', item.ID, ':', matchProduct);
                const tray = matchProduct ? matchProduct.piece_per_tray : 0;
                console.log('Tray for Production ID', item.ID, ':', tray);
                const total = item.import_quantity;
                const sumExport = Number(item.export_quantity) + Number(item.lost_quantity);
                const left = total - sumExport;
                const calTray = left / tray
                const allTray = total / tray
                const nameProduct = matchProduct ? matchProduct.name : 'Unknown';

                return (
                  <div key={item.id} className="mb-4 p-4 border border-gray-300 rounded-lg shadow-sm">
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
                    <p>ถาดทั้งหมด {allTray}</p>
                    <p>ถาดที่เหลือ {calTray}</p>
                    <div className="flex flex-col items-end gap-3">
                      <input
                        type="number"
                        min={1}
                        className="border p-2 rounded-md w-32"
                        placeholder="จำนวนถาด"
                      />

                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-32">
                        ส่งสินค้า
                      </button>

                      <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md w-32">
                        แจ้งปัญหา
                      </button>
                    </div>
                  </div>
                )
              })}

            </div>

          )}

      </div>

    </div>
  )
}

export default Station_3