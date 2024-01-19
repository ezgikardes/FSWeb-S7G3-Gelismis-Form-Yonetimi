import React, { useState } from 'react';
import './App.css';
import Form from './components/Form';

function App() {

  const [users, setUsers ] = useState([])

  const addNewUser = (newUser) => {
    setUsers([...users, newUser])
  }

  return (
    <div className="App">
      <h1>Merhaba</h1>
      <hr />
      {users.map(user => <div className='user-container'>
        <p>{user.name}</p>
        <p>{user.email}</p>
        <p>{user.toc ? "Kullanım Koşulları Onaylandı" : 
        "Kullanım Koşulları Reddedildi"}
        </p>
      </div>)}
      <Form addNewUser={addNewUser} />
    </div>
  );
}

export default App;
