// import { useState } from "react";
// import { storage, db } from "../firebase/firebaseConfig";
// import { getStorage, ref, uploadBytes } from "firebase/storage";
// import { getFirestore, collection } from "firebase/firestore";

// const ComplaintPage = () => {
//   const [image, setImage] = useState(null);
//   const [location, setLocation] = useState("");
//   const [description, setDescription] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       // Upload image to Firebase Storage
//       const storageRef = storage.ref();
//       const imageRef = storageRef.child(image.name);
//       await imageRef.put(image);

//       // Get download URL for the uploaded image
//       const imageUrl = await imageRef.getDownloadURL();

//       // Get user information from local storage
//       const user = JSON.parse(localStorage.getItem("user"));

//       // Store complaint data in Firebase Database
//       const complaintRef = db.collection("complaints").doc();
//       await complaintRef.set({
//         imageUrl,
//         location,
//         description,
//         userId: user.userId,
//         userName: user.name,
//         userEmail: user.email,
//       });

//       // Clear form fields
//       setImage(null);
//       setLocation("");
//       setDescription("");

//       // Provide feedback to the user
//       alert("Complaint submitted successfully!");
//     } catch (error) {
//       console.error("Error submitting complaint:", error);
//       alert("An error occurred while submitting the complaint.");
//     }
//   };

//   return (
//     <div>
//       <h2>Submit a Complaint</h2>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Upload Image:
//           <input type="file" onChange={(e) => setImage(e.target.files[0])} />
//         </label>
//         <label>
//           Location:
//           <input
//             type="text"
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//           />
//         </label>
//         <label>
//           Description:
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//           />
//         </label>
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default ComplaintPage;

// import { useState } from "react";
// import { storage, db } from "../firebase/firebaseConfig";
// import { getStorage, ref, uploadBytes } from "firebase/storage";
// import { getFirestore, collection } from "firebase/firestore";

// const ComplaintPage = () => {
//   const [image, setImage] = useState(null);
//   const [location, setLocation] = useState("");
//   const [description, setDescription] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!location || !description) {
//       alert("Please fill out all required fields (Location and Description).");
//       return; // Exit the function if validation fails
//     }

//     try {
//       // Upload image to Firebase Storage
//       const storageRef = ref(storage,"potholes");
//     //   const imageRef = child(storageRef, image.name);
//       await storageRef.put(image);

//       // Get download URL for the uploaded image
//       const imageUrl = await imageRef.getDownloadURL();

//       // Get user information (consider secure storage mechanism)
//       const user = JSON.parse(localStorage.getItem("user"));

//       // Store complaint data in Firebase Database
//       const complaintRef = db.collection("complaints").doc();
//       await complaintRef.set({
//         imageUrl,
//         location,
//         description,
//         userId: user.userId,
//         userName: user.name,
//         userEmail: user.email,
//       });

//       // Clear form fields
//       setImage(null);
//       setLocation("");
//       setDescription("");

//       // Provide feedback to the user
//       alert("Complaint submitted successfully!");
//     } catch (error) {
//       console.error("Error submitting complaint:", error);
//       alert("An error occurred while submitting the complaint.");
//     }
//   };

//   return (
//     <div>
//       <h2>Submit a Complaint</h2>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Upload Image:
//           <input type="file" onChange={(e) => setImage(e.target.files[0])} />
//         </label>
//         <label>
//           Location:
//           <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
//         </label>
//         <label>
//           Description:
//           <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
//         </label>
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default ComplaintPage;

// import { useState } from "react";
// import { storage, db} from "../firebase/firebaseConfig";
// // import { storage, db } from "../firebase/firebaseConfig";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { collection, addDoc } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";
// import { getAuth } from "firebase/auth";
// import { toast } from "react-toastify";

// export default function Complaint() {
//     const [image, setImage] = useState(null);
//     const [location, setLocation] = useState("");
//     const [description, setDescription] = useState("");
  
//     const handleImageChange = (e : any) => {
//       if (e.target.files[0]) {
//         setImage(e.target.files[0]);
//       }
//     };

//     const getLocation = () => {
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             const currentLocation = `${position.coords.latitude}, ${position.coords.longitude}`;
//             console.log("Current Location: ", currentLocation);
//             setLocation(currentLocation);
//           },
//           (error) => {
//             console.error("Error fetching location: ", error);
//             toast.error("Failed to fetch location. Please try again.");
//           }
//         );
//       } else {
//         console.error("Geolocation is not supported by this browser.");
//         toast.error("Geolocation is not supported by this browser.");
//       }
//     };
  
//     const handleSubmit = async (e : any) => {
//       e.preventDefault();
  
//       // Upload image to Firebase Storage
//       let imagePath = "";
//       try {
//         imagePath = await uploadImage(image, generateComplaintId());
//         console.log("Image uploaded successfully:", imagePath);
//       } catch (error) {
//         console.error("Error uploading image:", error);
//         return;
//       }
    
  
//       // Save complaint details in Firestore
//       try {
//         const auth = getAuth();
//         const user = auth.currentUser;
//         const complaintData = {
//           userName: user ? user.displayName : "Anonymous",
//           userEmail: user ? user.email : null,
//           location,
//           description,
//           imagePath,
//         };
  
        
//         await addDoc(collection(db, "complaints"), complaintData);
//         console.log("Complaint added successfully:", complaintData);
//       } catch (error) {
//         console.error("Error adding complaint:", error);
//       }
//     };
  
//     const generateComplaintId = () => {
//       // Generate a unique complaint ID (you can implement your own logic)
//       return "complaint_" + Math.random().toString(36).substr(2, 9);
//     };
  
//     const uploadImage = async (file: any, complaintId : any) => {
//         const storage = getStorage();
//         const storageRef = ref(storage, `potholes/${complaintId}`);
      
//         try {
//           // Upload the file to the specified path
//           await uploadBytes(storageRef, file);
      
//           // Get the downloadable URL of the uploaded image
//           const downloadURL = await getDownloadURL(storageRef);
      
//           return downloadURL; // Return the downloadable URL
//         } catch (error) {
//           console.error("Error uploading image:", error);
//           throw error; // Throw the error to handle it elsewhere if needed
//         }
//       };
  
//     return (
//       <div>
//         <h2>Submit a Complaint</h2>
//         <form onSubmit={handleSubmit}>
//           <div>
//             <label>Image:</label>
//             <input type="file" onChange={handleImageChange} />
//           </div>
//           <div>
//           <label htmlFor="location">Location:</label>
//         <button onClick={getLocation}>Fetch Location</button>
//         <input
//           type="text"
//           id="location"
//           value={location}
//           onChange={(e) => setLocation(e.target.value)}
//           placeholder="Enter location"
//         />
//           </div>
//           <div>
//             <label>Description:</label>
//             <textarea
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             ></textarea>
//           </div>
//           <button type="submit">Submit</button>
//         </form>
//       </div>
//     );
//   }



//==========================================================

// import { useState } from "react";
// import { storage, db } from "../firebase/firebaseConfig";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { collection, addDoc } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";
// import { getAuth } from "firebase/auth";
// import { toast } from "react-toastify";
// import firebase from "firebase/app";
// // import { firestore } from "firebase/firestore";
// import { GeoPoint } from "firebase/firestore";



// export default function Complaint() {
//   const [image, setImage] = useState(null);
//   const [location, setLocation] = useState({ latitude: 0.0, longitude: 0.0 });
//   const [description, setDescription] = useState("");
//   const navigate = useNavigate();

//   const handleImageChange = (e: any) => {
//     if (e.target.files[0]) {
//       setImage(e.target.files[0]);
//     }
//   };

//   const getLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           console.log("Current Location: ", latitude, longitude);
//           setLocation({ latitude, longitude });
//         },
//         (error) => {
//           console.error("Error fetching location: ", error);
//           toast.error("Failed to fetch location. Please try again.");
//         }
//       );
//     } else {
//       console.error("Geolocation is not supported by this browser.");
//       toast.error("Geolocation is not supported by this browser.");
//     }
//   };

//   const handleSubmit = async (e : any) => {
//     e.preventDefault();

//     // Upload image to Firebase Storage
//     let imagePath = "";
//     try {
//       imagePath = await uploadImage(image, generateComplaintId());
//       console.log("Image uploaded successfully:", imagePath);
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       return;
//     }

//     // Save complaint details in Firestore
//     try {
//       // const auth = getAuth();
//       // const user = auth.currentUser;
//       const user = JSON.parse(localStorage.getItem("loggedInUser")|| "{}");
//       console.log(user);
//       const complaintData = {
//         userName: user ? user.name : "Anonymous",
//         userEmail: user ? user.email : null,
//         location: new GeoPoint(location.latitude, location.longitude),
//           // (parseFloat(location.latitude),
//           // parseFloat(location.longitude)),
//         description,
//         imagePath,
//       };

//       await addDoc(collection(db, "complaints"), complaintData);
//       console.log("Complaint added successfully:", complaintData);

//       // Reset form values
//       setImage(null);
//       setLocation({ latitude: 0.0, longitude: 0.0 });
//       setDescription("");

//       // Notify user with the complaint ID
//       toast.success("Complaint submitted successfully!");
//     } catch (error) {
//       console.error("Error adding complaint:", error);
//       toast.error("Failed to submit complaint. Please try again.");
//     }
//   };

//   const generateComplaintId = () => {
//     // Generate a unique complaint ID
//     return "complaint_" + Math.random().toString(36).substr(2, 9);
//   };

//   const uploadImage = async (file : any, complaintId : any) => {
//     const storage = getStorage();
//     const storageRef = ref(storage, `potholes/${complaintId}`);

//     try {
//       // Upload the file to the specified path
//       await uploadBytes(storageRef, file);

//       // Get the downloadable URL of the uploaded image
//       const downloadURL = await getDownloadURL(storageRef);

//       return downloadURL; // Return the downloadable URL
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       throw error;
//     }
//   };

//   return (
//     <div>
//       <h2>Submit a Complaint</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Image:</label>
//           <input type="file" accept="image/*" onChange={handleImageChange} />
//         </div>
//         <div>
//           <label>Location:</label>
//           <button type="button" onClick={getLocation}>
//             Fetch Location
//           </button>
//           <input
//             type="text"
//             value={`${location.latitude}, ${location.longitude}`}
//             readOnly
//             placeholder="Location"
//           />
//         </div>
//         <div>
//           <label>Description:</label>
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//           ></textarea>
//         </div>
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// }

import { useState } from "react";
import { storage, db } from "../firebase/firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
//import { getAuth } from "firebase/auth";
import axios from "axios";
import { notifyError, notifySuccess } from "./notification";
// import firebase from "firebase/app";
// import { firestore } from "firebase/firestore";
//const GEOAPIFY_API_KEY = "aab8322082af437f8c8f401125d08f3b";
//const TOMTOM_API_KEY = "JOGnri5fGCkMPooG19P7fYf2hy6s58Sd";
//import { GeoPoint } from "firebase/firestore";

//import { fetchIpGeolocation } from '../components/geoIpApi'; // Adjust path as needed



export default function Complaint() {
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState({ latitude: 0.0, longitude: 0.0 });
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const [address, setAddress] = useState(null);
  
  const handleImageChange = (e: any) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const fetchAPI = async (): Promise<boolean> => {
    try {
      const formData = new FormData();
      if (!image) {
        notifyError("Please select an image.");
        setImage(null);
        // setLocation({ latitude: 0.0, longitude: 0.0 });
        setAddress(null);
        setDescription("");

        return false;
      }
      formData.append("file", image);
  
      const response = await axios.post(
        "http://127.0.0.1:5000/hasPotholes",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      // Handle response for pothole detection
      if (response.data === "True") { // Assuming "True" indicates potholes
        return true; // Indicate potholes detected
      } else {
        notifyError("No potholes detected. Please try again!");
        setImage(null);
        setLocation({ latitude: 0.0, longitude: 0.0 });
        setAddress(null);
        setDescription("");

        return false; // Indicate no potholes detected
      }
    } catch (error) {
      console.error("Error checking for potholes:", error);
      notifyError("Failed to check for potholes. Please try again.");
      setImage(null);
      setLocation({ latitude: 0.0, longitude: 0.0 });
      setAddress(null);
      setDescription("");
      return false; // Indicate error
    }
  };
  const generateComplaintId = () => {
    // Generate a unique complaint ID
    return "complaint_" + Math.random().toString(36).substr(2, 9);
  };

  const uploadImage = async (file: any, complaintId: any) => {
    const storage = getStorage();
    const storageRef = ref(storage, `potholes/${complaintId}`);

    try {
      // Upload the file to the specified path
      await uploadBytes(storageRef, file);

      // Get the downloadable URL of the uploaded image
      const downloadURL = await getDownloadURL(storageRef);

      return downloadURL; // Return the downloadable URL
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };
  const getLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const  latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log("Current Location: ", latitude, longitude);
          setLocation({ latitude, longitude });
         // fetchAddress(latitude, longitude);
        },
        (error) => {
          console.error("Error fetching location: ", error);
          notifyError("Allow location access");
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      notifyError("Geolocation is not supported by this browser.");
    }
  };

  // const fetchAddress = async (latitude : number, longitude: number) => {
  //   try {
  //     const url = `https://api.tomtom.com/search/2/reverseGeocode/${latitude},${longitude}.json?key=${TOMTOM_API_KEY}&radius=100`;
  //     const response = await fetch(url);
  //     console.log(response);

  //     if (!response.ok) {
  //       console.error('Error fetching address:', response.statusText);
  //       return; // Or handle error differently (e.g., set a default address)
  //     }

  //     const data = await response.json();
  //     console.log(data);

  //     if (data && data.addresses && data.addresses.length > 0) {
  //       const formattedAddress = data.addresses[0].freeFormAddress; // Or use other address components
  //       setAddress(formattedAddress);
  //     } else {
  //       console.error('No address found for provided coordinates.');
  //       setAddress(null);
       
  //     }
  //   } catch (error) {
  //     console.error('Error fetching address:', error);
  //     setAddress(null);
      
  //   }
  // };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const hasPotholes = await fetchAPI();
      if (!hasPotholes) {
        // Halt complaint submission if no potholes detected
        return;
      }
    }catch (error) {
      console.error("Error submitting complaint:", error);
      notifyError("Failed to submit complaint. Please try again.");
      setImage(null);
      setLocation({ latitude: 0.0, longitude: 0.0 });
      setAddress(null);
      setDescription("");
    }

    // Upload image to Firebase Storage
    let imagePath = "";
    try {
      imagePath = await uploadImage(image, generateComplaintId());
      
      console.log("Image uploaded successfully:", imagePath);
    } catch (error) {
      console.error("Error uploading image:", error);
      return;
    }

    // Save complaint details in Firestore
    try {
      // Assuming Firebase Authentication is set up
      const user = JSON.parse(localStorage.getItem("loggedInUser")|| "{}");

      const userName = user.name || "Anonymous"; // Use display name if available
      const userEmail = user.email || null;
      const fullComplaintId = generateComplaintId();

    // Extract ID without prefix for database storage
    const complaintId = fullComplaintId.slice(10)
    const currentDate = new Date();
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "June",
      "July", "Aug", "Sept", "Oct", "Nov", "De"
    ];

    const formattedDate = `${currentDate.getDate()} ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
      const complaintData = {
        
        userName,
        userEmail,
       // location: new GeoPoint(location.latitude, location.longitude),
        description,
        complaintId,
        imagePath,
        dateReported: formattedDate,
      };

      await addDoc(collection(db, "complaints"), complaintData);
      console.log("Complaint added successfully:", complaintData);
      notifySuccess("Complaint submitted successfully");

      // Reset form values
      setImage(null);
      setLocation({ latitude: 0.0, longitude: 0.0 });
      setAddress(null);
      setDescription("");
    } catch (error) {
      console.error("Error adding complaint:", error);
      //toast.error("Failed to submit complaint. Please try again.");
      notifyError("Failed to submit complaint. Please try again.");
      setImage(null);
      setLocation({ latitude: 0.0, longitude: 0.0 });
      setAddress(null);
      setDescription("");
    }

  };

  return (
        <div>
          <h2>Submit a Complaint</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Image:</label>
              <input type="file" name="file" accept="image/*" onChange={handleImageChange} />
            </div>
            <div>
            <label>Location:</label>
          <button type="button" onClick={getLocation}>
            Fetch Location
          </button>
          <input
            type="text"
            // value={address || "Fetching address..."} // Display address or fetching message
            
            // readOnly
            placeholder="Location"
          />
            </div>
            <div>
              <label>Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
  );
}

  