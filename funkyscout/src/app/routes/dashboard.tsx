import { motion } from 'framer-motion'
import './styles/dashboard.css'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
    const navgiate = useNavigate();

    return (
        <>
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.1 }}
                key="dashboard"
                id="dashboard"
            >
                <div id="dashboard-main">
                    <div id="dashboard-scouting">
                        <div id="dashboard-section">
                            <div id='dashboard-section-header'>
                                Start Scouting
                            </div>
                            <div id='dashboard-section-details'>
                                Next Shift • No data
                            </div>
                        </div>
                        <button id='dashboard-scouting-submit' onClick={() => navgiate('/scouting')}>
                            <i className="fa-solid fa-arrow-right" />
                        </button>
                    </div>
                    <div id="dashboard-scouting-overview">
                        <div id="overview-left">
                            <div id='dashboard-section-header'>
                                Scouting Overview
                            </div>
                            <div id='dashboard-section-details'>
                                 Matches left
                            </div>
                            <div id='dashboard-section-details' className='dim'>
                                0 of 0 pits done
                            </div>
                            <div id='dashboard-section-seperator' />
                            <div id='dashboard-section-details'>
                                Scouting as
                            </div>
                            <div id='dashboard-section-details' className='dim'>
                                {localStorage.getItem('user')}
                            </div>
                        </div>
                        <div id="dashboard-overview-progress">

                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    )

}
export default Dashboard;