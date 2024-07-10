import {BrowserRouter as Router, Routes, Route } from "react-router-dom"
import './App.css'
import Home from "./Components/Home"
import UserProfile from "./Components/UserProfile"
import Navbar from "./Components/Navbar"
import { useState, useEffect } from "react"
import UsersList from "./Components/UsersList"
import UserForm from "./Components/UserForm"
import PlantList from "./Components/PlantList"
import PlantProfile from "./Components/PlantProfile"
import UserDutyForm from "./Components/UserDutyForm"
import PlantForm from "./Components/PlantForm"


function App() {

  const [users, setUsers] = useState([])
  const [plants, setPlants] = useState([])
  const [duties, setDuties] = useState([])
  const [countries, setCountries] = useState([])
  const [message, setMessage] = useState([])
  const [loading, setLoading] = useState(true);

  const fetchUsers = async() => {
    const response = await fetch('http://localhost:8080/people');
    const data = await response.json();
    setUsers(data);
  }

  const fetchPlants = async() => {
    const response = await fetch('http://localhost:8080/plants');
    const data = await response.json();
    setPlants(data);
  }

  const fetchDuties = async() => {
    const response = await fetch('http://localhost:8080/duties');
    const data = await response.json();
    setDuties(data);
  }

  const fetchCountries = async() => {
    const response = await fetch('http://localhost:8080/countries');
    const data = await response.json();
    setCountries(data);
  }

  const fetchInstructions = async (id) => {
    const response = await fetch(`http://localhost:8080/plants/message/${id}`);
    const data = await response.json();
    return data;
  }

  const showInformation = async (id) => {
    const message = await fetchInstructions(id);
    setMessage(message);
  }

  const fetchData = async () => {
    try {
      await Promise.all([
        fetchUsers(),
        fetchPlants(),
        fetchDuties(),
        fetchCountries(),
      ]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const postUser = async (newUser) => {
    const response = await fetch("http://localhost:8080/people", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(newUser)
    });
    const savedUser = await response.json();
    setUsers([...users, savedUser]);
  }

  const postDuty = async (newDuty) => {
    const response = await fetch("http://localhost:8080/duties", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(newDuty)
    });
    const savedDuty = await response.json();
    setDuties([...duties, savedDuty]);
  }

  const deleteDuty = async (id) => {
    const response = await fetch(`http://localhost:8080/duties/${id}`, {
      method: "DELETE"
    });
    if(response.ok){
      await fetchDuties();
    } else {
      console.error("Failed to delete duty")
    }
  }

  const getPlant = async (id) => {
    const response = await fetch(`http://localhost:8080/plants/${id}`);
    const data = await response.json();
    return data;
  };

  const waterPlant = async (id) => {
    const response = await fetch(`http://localhost:8080/plants/${id}/water-plant`, {
      method: 'PATCH'
    });
    if (response.ok) {
      // Refresh the plant data
      await fetchPlants();
    } else {
      console.error('Failed to water plant');
    }
  }

  const postPlant = async (newPlant) => {
    const response = await fetch("http://localhost:8080/plants", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(newPlant)
    });
    const savedPlant = await response.json();
    setPlants([...plants, savedPlant]);
  }

  

  return (
    <Router>
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/users" element={<UsersList users={users} />} />
        <Route path="/users/:id" element={<UserProfile users={users} duties={duties} message={message} showInformation={showInformation} deleteDuty={deleteDuty}/>} />
        <Route path="/plants" element={<PlantList users={users} plants={plants} countries={countries} />} />
        <Route path="/plants/:id" element={<PlantProfile users={users} plants={plants} countries={countries} duties={duties} waterPlant={waterPlant} getPlant={getPlant} />} />
        <Route path="/users/create" element={<UserForm postUser={postUser}/>} />
        <Route path="/plants/create" element={<PlantForm postPlant={postPlant} countries={countries}/>} />
        <Route path="/users/:id/add-duty" element={<UserDutyForm users={users} plants={plants} duties={duties} postDuty={postDuty} fetchPlants={fetchPlants}/> } />
        {/* add more routes if needed */}
      </Routes>    
    </div>
    </Router>
  )
}

export default App;
