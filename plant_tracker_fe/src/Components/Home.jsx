import React from 'react';
import { useTranslation } from 'react-i18next';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PlantTracker from '../assets/PlantTracker.png';
import './styles/Home.css';
import Calendar from './Calendar';

const Home = ({ events}) => {
    const { t } = useTranslation();

    return (
        <>
        <Container>
            <Row>
                <Col>
                    <div className="home">
                        <img src={PlantTracker} className='plant-tracker-logo-lg' alt={t('plantTrackerLogo')}/>
                        <h3>{t('trackNurture')}</h3>
                        <h4 className='calendar-title'>Upcoming plants to be Watered!</h4>
                    </div>
                    <Calendar events={events} />
                </Col>
            </Row>
        </Container>
        </>
    );
};

export default Home;