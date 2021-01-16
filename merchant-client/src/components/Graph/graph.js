import React from 'react';
import './graph.css';
import { CanvasJSChart } from 'canvasjs-react-charts';

const Graph = () =>{
    const options = {
        animationEnabled: true,
        title:{
            text: ""
        },
        axisX: {
            title:"Week",
        },
        axisY: {
            title: "Sales (in USD)",
            prefix: "$"
        },
        data: [{
            yValueFormatString: "$#,###",
            type: "spline",
            dataPoints: [
                { x: new Date(2021, 0, 12), y: 21060 },
                { x: new Date(2021, 0, 13), y: 27980 },
                { x: new Date(2021, 0, 14), y: 42800 },
                { x: new Date(2021, 0, 15), y: 32400 },
                { x: new Date(2021, 0, 16), y: 35260 },
                { x: new Date(2021, 0, 17), y: 33900 },
                { x: new Date(2021, 0, 18), y: 40000 },
                { x: new Date(2021, 0, 19), y: 52500 },
            ]
        }]
    }

    return(
        <div className="graph">
            <CanvasJSChart options={ options }/>
        </div>
    )

}

export default Graph;