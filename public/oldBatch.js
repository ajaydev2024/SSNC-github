import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Loading from '@/components/Loading';
import DataFetcher from '@/components/DataFetcher'; // Adjust the path as needed
import { useRouter } from 'next/router';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useInventory } from '@/components/mongoSchema';


const Batch = ({ itemData }) => {
  const contentRef = useRef();
  const router = useRouter();
  let { selectedItem } = router.query;
  selectedItem = decodeURIComponent(selectedItem);
  const { state, dispatch } = useInventory();
  const [totalServings, setTotalServings] = useState(0);
  const [boxes, setBoxes] = useState('');
  const [Addboxes1, setAddboxes1] = useState('')
  const [boxElements, setBoxElements] = useState([]);
  const [totalBoxElements, setTotalBoxElements] = useState(0);
  const [batch1, setBatch1] = useState('');
  const [batch1Elements, setBatch1Elements] = useState([]);
  const [totalBatch1Elements, setTotalBatch1Elements] = useState(0);
  const [batch2, setBatch2] = useState('');
  const [batch2Elements, setBatch2Elements] = useState([]);
  const [totalBatch2Elements, setTotalBatch2Elements] = useState(0);
  const [batch3, setBatch3] = useState('');
  const [batch3Elements, setBatch3Elements] = useState([]);
  const [totalBatch3Elements, setTotalBatch3Elements] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (itemData) {
      const totalServingsValue = itemData
        .filter(item => !item.PackagingName)
        .reduce((total, item) => total + item.servings, 0);
      setTotalServings(totalServingsValue);
      calculateNoOfBoxes(parseFloat(boxes), totalServingsValue);
      calculateBatch1(parseFloat(batch1), totalServingsValue);
      calculateBatch2(parseFloat(batch2), totalServingsValue);
      calculateBatch3(parseFloat(batch3), totalServingsValue);
    }
    setLoading(false);

  }, [boxes, batch1, batch2, batch3,]);

  function validateNumber(value) {
    return !isNaN(value) && value >= 0;
  }

  function calculateNoOfBoxes(boxesValue, totalServingsValue) {
    if (validateNumber(boxesValue)) {
      const newBoxElements = itemData
        .filter(item => !item.PackagingName)
        .map(item => ((item.servings / totalServingsValue) * boxesValue * 250) / 1000);
      setBoxElements(newBoxElements.map(value => value.toFixed(2)));
      setTotalBoxElements(newBoxElements.reduce((total, item) => total + item, 0).toFixed(2));
    } else {
      setBoxElements([]);
      setTotalBoxElements(0);
    }
  }

  function calculateBatch1(batchValue, totalServingsValue) {
    if (validateNumber(batchValue)) {
      const newBatch1Elements = itemData
        .filter(item => !item.PackagingName)
        .map(item => (batchValue / totalServingsValue) * item.servings);
      setBatch1Elements(newBatch1Elements.map(value => value.toFixed(2)));
      setTotalBatch1Elements(newBatch1Elements.reduce((total, item) => total + item, 0).toFixed(2));
    } else {
      setBatch1Elements([]);
      setTotalBatch1Elements(0);
    }
  }

  function calculateBatch2(batchValue, totalServingsValue) {
    if (validateNumber(batchValue)) {
      const newBatch2Elements = itemData
        .filter(item => !item.PackagingName)
        .map(item => (batchValue / totalServingsValue) * item.servings);
      setBatch2Elements(newBatch2Elements.map(value => value.toFixed(2)));
      setTotalBatch2Elements(newBatch2Elements.reduce((total, item) => total + item, 0).toFixed(2));
    } else {
      setBatch2Elements([]);
      setTotalBatch2Elements(0);
    }
  }

  function calculateBatch3(batchValue, totalServingsValue) {
    if (validateNumber(batchValue)) {
      const newBatch3Elements = itemData
        .filter(item => !item.PackagingName)
        .map(item => (batchValue / totalServingsValue) * item.servings);
      setBatch3Elements(newBatch3Elements.map(value => value.toFixed(2)));
      setTotalBatch3Elements(newBatch3Elements.reduce((total, item) => total + item, 0).toFixed(2));
    } else {
      setBatch3Elements([]);
      setTotalBatch3Elements(0);
    }
  }
  //const sheets = itemData.map(item => ({    sheetName: item.title,    data: item.materials.filter(material => material.value !== null), }));
  const dataToSave = {
    selectedItem,
    itemData,
    totalServings,
    boxes,
    batch1,
    batch2,
    batch3,
    boxElements,
    batch1Elements,
    batch2Elements,
    batch3Elements,
    totalBoxElements,
    totalBatch1Elements,
    totalBatch2Elements,
    totalBatch3Elements,
  };
  const handleSaveToJson = async () => {
    try {
      const response = await fetch(`/api/saveToJson?selectedItem=${encodeURIComponent(selectedItem)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: dataToSave }),
      });

      if (response.ok) {
        console.log('Data saved successfully');
      } else {
        console.error('Error saving data');
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
    dispatch({ type: 'DEDUCT_ITEM', payload: dataToSave });

  };

  const generatePdfWithWatermark = () => {
    // Create a new jsPDF instance
    const pdf = new jsPDF('l', 'px', 'a4');

    // Create a new canvas element
    const canvas = document.createElement('canvas');
    canvas.width = contentRef.current.offsetWidth;
    canvas.height = contentRef.current.offsetHeight;
    const context = canvas.getContext('2d');

    // Draw the content of the div onto the canvas
    html2canvas(contentRef.current).then(contentCanvas => {
      context.drawImage(contentCanvas, 0, 0, canvas.width, canvas.height);

      // Add content image to PDF
      const contentDataUrl = canvas.toDataURL('image/jpeg');
      pdf.addImage(contentDataUrl, 'JPEG', 0, 0);

      // Add watermark to PDF
      const watermarkImage = new Image();
      watermarkImage.src = '/Logo.png'; // Update the path to your watermark image
      watermarkImage.onload = () => {
        const watermarkWidth = canvas.width / 2; // Adjust the watermark size as needed
        const watermarkHeight = (watermarkWidth * watermarkImage.height) / watermarkImage.width;

        // Apply watermark effect
        context.globalAlpha = 0.3; // Adjust the opacity of the watermark
        context.drawImage(
          watermarkImage,
          (canvas.width - watermarkWidth) / 2, // Center horizontally
          (canvas.height - watermarkHeight) / 2, // Center vertically
          watermarkWidth,
          watermarkHeight
        );

        // Save or open the PDF
        pdf.save(`${selectedItem}.pdf`);
      };
    });
  };
  return (
    <div id='inventoryPage'>
      <Navbar />
      <div id='batch' className='mx-2' ref={contentRef}>
        {selectedItem && (
          <h1 className='text-center text-white pb-4'>Product Details of {selectedItem.substr(0, selectedItem.length - 3)}</h1>
        )}
        {loading && itemData === null ? ( // Show loading icon only when loading and no data
          <Loading /> // Your loading component
        ) : itemData ? (
          <div className='table-responsive'>
            <table className='table' >
              <thead>
                <tr >
                  <th className='pb-4'>Material</th>
                  <th className='pb-4'>Servings (in Grams)</th>
                  <th className='pb-4'>
                    <input
                      className='outline-none text-center'
                      type='number'
                      placeholder='Enter No of Boxes'
                      value={boxes}
                      onChange={(e) => {
                        if (validateNumber(e.target.value)) {
                          setBoxes(e.target.value);
                        }
                      }}
                    />
                  </th>
                  <th className='pb-4'>
                    <input
                      className='outline-none text-center'
                      type='number'
                      placeholder='Enter Batch (in Kg)'
                      value={batch1}
                      onChange={(e) => {
                        if (validateNumber(e.target.value)) {
                          setBatch1(e.target.value);
                        }
                      }}
                    />
                  </th>
                  <th className='pb-4'>
                    <input
                      className='outline-none text-center'
                      type='number'
                      placeholder='Enter Batch (in Kg)'
                      value={batch2}
                      onChange={(e) => {
                        if (validateNumber(e.target.value)) {
                          setBatch2(e.target.value);
                        }
                      }}
                    />
                  </th>
                  <th className='pb-4'>
                    <input
                      className='outline-none text-center'
                      type='number'
                      placeholder='Enter Batch (in Kg)'
                      value={batch3}
                      onChange={(e) => {
                        if (validateNumber(e.target.value)) {
                          setBatch3(e.target.value);
                        }
                      }}
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {itemData.map((item, index) => {
                  if (item.PackagingName) {
                    return null;
                  }
                  return (
                    <tr key={index}>
                      <td >{item.name}</td>
                      <td className='pb-4 '>{item.servings}</td>
                      <td className='pb-4 '>{boxElements[index]}</td>
                      <td className='pb-4'>{batch1Elements[index]}</td>
                      <td className='pb-4'>{batch2Elements[index]}</td>
                      <td className='pb-4'>{batch3Elements[index]}</td>
                    </tr>

                  );
                })}

                <tr className=' text-green-500 text-3xl font-extrabold'>
                  <td className='pb-4'>Total :</td>
                  <td className='pb-4'>{totalServings.toFixed(2)}</td>
                  <td className='pb-4'>{totalBoxElements}</td>
                  <td className='pb-4'>{totalBatch1Elements}</td>
                  <td className='pb-4'>{totalBatch2Elements}</td>
                  <td className='pb-4'>{totalBatch3Elements}</td>
                </tr>
              </tbody>
            </table>

            <table className='w-1/3 pb-4'>
              <thead>
                <tr className='pb-4'>
                  <th>Packaging Material</th>
                  <th>Requirements</th>
                </tr>
              </thead>
              <tbody>
                {/* Product Items */}
                {itemData.map((item, index) => {
                  if (item.name) {
                    return null;
                  }
                  return (
                    <tr key={index}>
                      <td className='pb-4'>{item.PackagingName}</td>

                      {item.PackagingName === 'Carton 19oz - 12pk' ? (
                        <td className='text-center'>
                          {boxes || batch1 || batch2 || batch3 ? (parseFloat(boxes || batch1 || batch2 || batch3) / 12).toFixed(1) : ''}
                        </td>

                      ) : (
                        <td className='text-center'>{boxes || batch1 || batch2 || batch3}</td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* <ExcelExportButton sheets={sheets} />*/}
          </div>
        ) : (
          <p className='text-center'>No data available</p>
        )}

      </div>
      <button onClick={handleSaveToJson}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
        <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg>
        <span>Save File to Server & Deduct items From Main Inventory</span>
      </button>
      <button onClick={generatePdfWithWatermark}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
        <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg>
        <span>export to PDF</span>
      </button>

    </div>);
};
export async function getServerSideProps(context) {
  const { selectedItem } = context.query;

  try {
    const itemData = await DataFetcher(context, selectedItem);

    return {
      props: {
        itemData: itemData !== null ? itemData : null,
      },
    };
  } catch (error) {
    console.error('Error fetching item data:', error);
    return {
      props: {
        itemData: null,
      },
    };
  }
}
export default Batch;

export const metadata = {
  title: '`${itemData.title}`',
  description: 'Generated by A-jay Development Team',
};
