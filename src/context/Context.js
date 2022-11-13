import { createContext, useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { ref, push, set, onValue, remove } from "firebase/database";

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  // Get Form Data
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");

  // StorageData
  const [storageUserData, setStorageUserData] = useState();

  // FormUpdate
  const [isUpdate, setIsUpdate] = useState(false);

  // UserData
  const [userData, setUserData] = useState([]);

  // Func Section

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newContact = {
      userName,
      phoneNumber,
      gender,
    };
    setUserData([...userData, newContact]);
    saveToDatabase(newContact);
  };

  // Firebase

  const saveToDatabase = (item) => {
    const userRef = ref(db, "Contact");
    const newUserRef = push(userRef)
    set(newUserRef, {
        ...item
    });
  };
  

  useEffect(() => {
    const userRef = ref(db, "Contact")
    onValue(userRef, (details) => {
        const data = details.val();
        const contactArr = []
        for (let id in data) {
            contactArr.push({id, ...data[id]})
        }
        setUserData(contactArr)
    })
  }, []);

  // Delete

  const deleteDatabaseData = (item) => {
    remove(ref(db, "Contact/" + item.id))
  }

  return (
    <Context.Provider
      value={{
        setUserData,
        userData,
        setGender,
        setPhoneNumber,
        setUserName,
        gender,
        phoneNumber,
        userName,
        isUpdate,
        setIsUpdate,
        handleFormSubmit,
        deleteDatabaseData,
      }}
    >
      {children}
    </Context.Provider>
  );
};