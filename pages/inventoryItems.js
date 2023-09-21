import React, { useState } from 'react';
import Collapse from 'react-collapse';
import Navbar from '../components/Navbar';
import { readdir, readFile, stat } from 'fs/promises';
import { join, extname } from 'path';

const InventoryItems = ({ itemData }) => {
    const [items, setItems] = useState(itemData);

    const toggleAccordion = (index) => {
        setItems((prevItems) =>
            prevItems.map((item, idx) => ({
                ...item,
                isOpen: idx === index ? !item.isOpen : false,
            }))
        );
    };

    return (
        <>
            <div id='inventoryPage'>
                <Navbar />
                <h1 className='text-center text-2xl'>All Inventory List</h1>
                <div className='accordion-container'>
                    {items.length > 0 && (
                        <div className='list-decimal text-center bg-white rounded-lg mt-8 p-4 '>
                            {items.map((item, index) => (
                                <div className='list-decimal' key={index}>
                                    <button
                                        onClick={() => toggleAccordion(index)}
                                        className='accordion cursor-pointer rounded-lg font-bold'
                                    >
                                        {index + 1}): {item.title}
                                    </button>
                                    <Collapse isOpened={item.isOpen}>
                                        <div className='panel'>
                                            <div className='table-responsive'>
                                                <table className='table'>
                                                    <thead>
                                                        <tr>
                                                            <th>Material</th>
                                                            <th>Quantity</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    {Object.keys(item).map((key, index) => {
                                                            if (key !== 'fileName' && key !== 'title' && key !== 'birthDate' && key !== 'isOpen') {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td>{key}</td>
                                                                        <td>{item[key]}</td>
                                                                    </tr>
                                                                );
                                                            }
                                                            return null;
                                                        })}
                                                        </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </Collapse>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export async function getServerSideProps(context) {
    try {
        const dirPath = join(process.cwd(), 'JSONData', 'InventoryList');
        const fileNames = await readdir(dirPath);

        const fileStatsPromises = fileNames.map(async (fileName) => {
            const ext = extname(fileName);
            if (ext === '.json') {
                const filePath = join(dirPath, fileName);
                try {
                    const contentStat = await stat(filePath);
                    return { fileName, stat: contentStat };
                } catch (statError) {
                    console.error(`Error getting file stat for ${fileName}:`, statError);
                    return null;
                }
            }
            return null;
        });

        const fileStats = await Promise.all(fileStatsPromises);

        const validJsonFileContents = await Promise.all(
            fileStats
                .filter((content) => content !== null)
                .map(async (content) => {
                    const { fileName } = content;
                    const filePath = join(dirPath, fileName);
                    try {
                        const contentBuffer = await readFile(filePath); // Add this line
                        const parsedContent = JSON.parse(contentBuffer);
                        return { fileName, ...parsedContent, birthDate: content.stat.birthtimeMs };
                    } catch (readError) {
                        console.error(`Error reading or parsing file ${fileName}:`, readError);
                        return null;
                    }
                })
        );

        // Filter out null contents
        const filteredContents = validJsonFileContents.filter((content) => content !== null);
        const sortedContents = filteredContents.sort((a, b) => a.birthDate - b.birthDate);

        return {
            props: {
                itemData: sortedContents,
            },
        };
    } catch (error) {
        console.error('Error fetching item data:', error);
        return {
            props: {
                itemData: [],
            },
        };
    }
}

export default InventoryItems;
