import React, { useState, useEffect } from 'react';
import Collapse from 'react-collapse';
import Navbar from '../components/Navbar';
import axios from 'axios'; // Import Axios for making API requests

const Summary = () => {
  const [summaryItems, setSummaryItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiEndpoint = `${window.location.origin}/api/mongo/setMongoBatch`;
        const saveResponse = await fetch(apiEndpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const responseData = await saveResponse.json();
        console.log("batch :",responseData)
        setSummaryItems(responseData); // Assuming responseData is an array of objects
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const toggleAccordion = (index) => {
    setSummaryItems(prevSummaryItems => {
      const updatedSummaryItems = prevSummaryItems.map((item, idx) => ({
        ...item,
        isOpen: idx === index ? !item.isOpen : false
      }));
      return updatedSummaryItems;
    });
  };


  return (
    <div id="batch">
      <Navbar />
      <h1 className="text-center text-2xl">Summary Page of Every Item</h1>
      <div className="accordion-container">
        {summaryItems.map((jsonItem, index) => (
          <div className="list-decimal">
            <button
              onClick={() => toggleAccordion(index)}
              className="accordion cursor-pointer rounded-lg font-bold"
            >
              {jsonItem.fileName}
            </button>
            <Collapse isOpened={jsonItem.isOpen}>
              <div className="panel">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Material</th>
                      <th>Quantity</th>
                      <th>{jsonItem.boxes}</th>
                      <th>{jsonItem.batch1}</th>
                      <th>{jsonItem.batch2}</th>
                      <th>{jsonItem.batch3}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jsonItem.itemData[1] && (
                      <tr>
                        {Object.keys(jsonItem.itemData[1]).map((key, index) => (
                          <td key={index} >{key}</td>
                        ))}
                      </tr>
                    )}
                    {jsonItem.itemData.map((item, innerIndex) => (
                      <tr key={innerIndex}>
                        {Object.values(item).map((value, valueIndex) => (
                          <td key={valueIndex}>{value !== null ? value : 'N/A'}</td>
                        ))}
                        <td>{jsonItem.boxElements[innerIndex + 1]}</td>
                        <td>{jsonItem.batch1Elements[innerIndex + 1]}</td>
                        <td>{jsonItem.batch2Elements[innerIndex + 1]}</td>
                        <td>{jsonItem.batch3Elements[innerIndex + 1]}</td>
                      </tr>
                    ))}
                    <tr className="text-green-500 text-3xl font-extrabold">
                      <td>Total :</td>
                      <td></td>
                      <td></td>
                      <td>{jsonItem.totalBoxElements}</td>
                      <td>{jsonItem.totalBatch1Elements}</td>
                      <td>{jsonItem.totalBatch2Elements}</td>
                      <td>{jsonItem.totalBatch3Elements}</td>
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

                  </tbody>
                </table>
              </div>
            </Collapse>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Summary;
