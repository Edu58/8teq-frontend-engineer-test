import './App.css'
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, LineElement, Legend, CategoryScale, LinearScale, PointElement } from 'chart.js';
ChartJS.register(
  Title, Tooltip, LineElement, Legend,
  CategoryScale, LinearScale, PointElement
)


function App() {
  const [xValues, setXValues] = useState([])
  const [labels, setLabels] = useState([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedChoice, setSelectedChoice] = useState('')

  const choices = [
    "Open",
    "High",
    "Low",
    "Close",
    "Volume",
    "Ex-Dividend",
    "Split Ratio",
    "Adj. Open",
    "Adj. High",
    "Adj. Low",
    "Adj. Close",
    "Adj. Volume",
  ]

  const newestAvailableDate = "2018-03-27"
  const oldest_available_date = "2012-05-18"

  useEffect(() => {
    async function getData() {
      setXValues([])
      setLabels([])

      await fetch(`https://data.nasdaq.com/api/v3/datasets/WIKI/FB.json?column_index=${selectedChoice}&start_date=${startDate}&end_date=${endDate}&api_key=V2-fv39uuVhQssymzNww`)
        .then(async res => await res.json())
        .then(data => {
          console.log(data)
          const values = data.dataset.data

          // extract year to be used as labels and values to be used in y axis
          if (values) {
            values.map(async i => {
              setLabels(lbs => [...lbs, i[0]])
              setXValues(vals => [...vals, i[1]])
            })
          }
        })
        .catch(err => console.log(err))
    }

    getData()
  }, [selectedChoice, startDate,endDate])

  const graphData = {
    labels: labels,
    datasets: [
      {
        label: "End of day stock prices for Facebook",

        data: xValues,
        tension: 0.4,
        pointStyle: 'circ',
        pointBorderColor: 'green',
        pointBackgroundColor: '#fff',
        borderColor: 'rgb(75, 192, 192)',
        showLine: true,
      }
    ]
  }

  return (

    <div className='container d-flex pt-5 min-vh-100'>
      <div className='search me-4'>
        <p className='nasdaq fs-4 fw-bold'>Nasdaq</p>
        <input type="text" name="search" className='form-control' placeholder='Type to search' />
        <div className="companies mt-1">

        </div>
      </div>
      <div className="graph">
        <div className="top d-flex justify-content-between">
          <p className='company fs-4'>Facebook</p>
          <div className='d-flex align-items-center'>
            <div className='d-flex flex-column'>
              <span className='text-center'>Start Date {startDate ? null : <span className='text-danger'>*</span>} </span>
              <div className='d-flex'>
                <i class='bx bx-calendar fs-2 me-1'></i>
                <input type="date" className='date form-control text-light' min={oldest_available_date} max={newestAvailableDate} defaultValue={oldest_available_date} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              
            </div>
            <div className='d-flex flex-column'>
              <span className='text-center'>End Date {endDate ? null : <span className='text-danger'>*</span>}</span>
              <input type="date" className='date form-control text-light' min={oldest_available_date} max={newestAvailableDate} defaultValue={newestAvailableDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="d-flex flex-column">
          <div className="choose">
            {selectedChoice ? null : <span className='text-danger text-center'>please choose *</span>}
            <select className="form-select"
              onChange={(e) => setSelectedChoice(e.target.value)} >
              <option selected>Choose</option>
              {choices.map((choice, i) => {
                return (
                  <option key={i} value={i}>{choice}</option>
                )
              })}
            </select>
          </div>
          <div className="App" style={{ width: '100%', height: 'auto' }}>
            <Line data={graphData}></Line>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;