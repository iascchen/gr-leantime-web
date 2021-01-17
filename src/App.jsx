import React from 'react'
import Gantt from './Gantt'
import './App.scss'

const App = () => {
    return (
        <div className='App'>
            <div>
                <h1> gantt-for-react </h1>
                <h3>
                    Frappe Gantt components for React wrapper.
                    <a href='https://github.com/hustcc/gantt-for-react'>hustcc/gantt-for-react</a>
                </h3>

                <Gantt />

                <h3>Get it on GitHub! <a href='https://github.com/hustcc/gantt-for-react'>hustcc/gantt-for-react</a></h3>
            </div>
        </div>
    )
}

export default App
