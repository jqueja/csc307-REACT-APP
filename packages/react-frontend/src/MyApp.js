import React, {useState, useEffect} from 'react';
import Table from "./Table"
import Form from './Form';

  
  function MyApp() {
    const [characters, setCharacters] = useState([]); 


    function deleteUser(user) {
      const { id } = user;
    
      fetch(`http://localhost:8000/users/${id}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.status === 204) {
            console.log(`User with ID ${id} deleted successfully.`);
          } else if (response.status === 404) {
            console.log(`User with ID ${id} not found.`);
          } else {
            console.log(`Failed to delete user with ID ${id}.`);
          }
        })
        .catch((error) => {
          console.error('Error deleting user:', error);
        });
    }

    function removeOneCharacter (index) {
      const updated = characters.filter((character, i) => {
          return i !== index
      });
      deleteUser(characters[index])
      setCharacters(updated);
  }


  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
}

  function generateRandomId() {
    return Math.floor(Math.random() * 50 + 1);
  }

function postUser(person) {
  const promise = fetch("Http://localhost:8000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(person),
  });

  return promise;
}

function updateList(person) {
  const randomId = generateRandomId();
  const userWithId = {
    id: randomId,
    ...person,
  };

  postUser(userWithId)
    .then((response) => {
      if (response.status === 201) {
        if (response.ok) {
          return response.json();
        }
      } else {
        throw new Error('Failed to insert user');
      }
    })
    .then((json) => {
      setCharacters([...characters, json]);
      window.location.reload(); // Reload the page after successful submission
    })
    .catch((error) => {
      console.log(error);
    });
}

useEffect(() => {
  fetchUsers()
	  .then((res) => res.json())
	  .then((json) => setCharacters(json["users_list"]))
	  .catch((error) => { console.log(error); });
}, [] );
      
    return (
      <div className="container">
        <Table characterData={characters} 
          removeCharacter={removeOneCharacter} />
        <Form handleSubmit={updateList}/>
      </div>
    )
  }
  
export default MyApp;