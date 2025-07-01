import { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext(); 

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); 

    useEffect(() => {
        fetch(`${import.meta.env.VITE_URL}/me`, { credentials: "include" })
            .then((response) => response.json())
            .then((data) => {
                if (data.id) {
                    setUser(data); // Persist login state
                    console.log("USER INSIDE, create context file")
                }
                console.log("THIS IS FROM CREATE CONTEXT")
            });
    }, []);


    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}
export const useUser = () => useContext(UserContext);
