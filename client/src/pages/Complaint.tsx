import { useState } from "react";
import { storage, db } from "../firebase/firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useRef } from "react";
import { notifyError, notifySuccess } from "./notification";
//const GEOAPIFY_API_KEY = "aab8322082af437f8c8f401125d08f3b";
//const TOMTOM_API_KEY = "JOGnri5fGCkMPooG19P7fYf2hy6s58Sd";

//import { fetchIpGeolocation } from '../components/geoIpApi'; // Adjust path as needed



export default function Complaint() {
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [severity, setSeverity] = useState(0);
  const [address, setAddress] = useState(null);
  const fileInput = document.getElementById('fileInput')as HTMLInputElement;
  
  const handleImageChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
      console.log("image selected");

      // Display selected image preview
      const reader = new FileReader();
      reader.onload = () => {
        console.log("inside onload");

        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
          console.log("inside string");
        }
      };
      reader.readAsDataURL(selectedImage);

    }
  };


  


  const checkForPotholes = async (): Promise<boolean> => {
    try {
      const formData = new FormData();
      if (!image) {
        notifyError("Please select an image.");
        setImage(null);
        if (fileInput) {
          fileInput.value = ''; // Clear the input field value
        }
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
        if (fileInput) {
          fileInput.value = ''; // Clear the input field value
        }
        setLocation("");
        setAddress(null);
        setDescription("");

        return false; // Indicate no potholes detected
      }
    } catch (error) {
      console.error("Error checking for potholes:", error);
      notifyError("Failed to check for potholes. Please try again.");
      setImage(null);
      if (fileInput) {
        fileInput.value = ''; // Clear the input field value
      }
      setLocation("");
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const hasPotholes = await checkForPotholes();
      if (!hasPotholes) {
        return;
      }
    }catch (error) {
      console.error("Error submitting complaint:", error);
      notifyError("Failed to submit complaint. Please try again.");
      setImage(null);
      if (fileInput) {
        fileInput.value = ''; // Clear the input field value
      }
      setLocation("");
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
      "July", "Aug", "Sept", "Oct", "Nov", "Dec"
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
      if (fileInput) {
        fileInput.value = ''; // Clear the input field value
      }
      setLocation("");
      setAddress(null);
      setDescription("");
    } catch (error) {
      console.error("Error adding complaint:", error);
      notifyError("Failed to submit complaint. Please try again.");
      setImage(null);
      if (fileInput) {
        fileInput.value = ''; // Clear the input field value
      }
      setLocation("");
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
               <input type="file" id="fileInput" name="file" accept="image/*" onChange={handleImageChange}  />
               {imageUrl && <img src={imageUrl} alt="Selected Image" className="mt-2 max-w-xs h-64 rounded-md" />}
            </div>
            <div>
            <label>Location:</label>
          <input
            type="text"
            placeholder=" Add a Location"
          />
            </div>
            <div>
          <label>Severity (Ranging from 0-10):</label>
          <input
            type="range"
            min="0"
            max="10"
            value={severity}
            onChange={(e) => setSeverity(parseInt(e.target.value))}
          />
          <p>Severity: {severity}</p> {/* Display the current severity value */}
        </div>
            <div>
              <label>Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add supporting comments to your report"
              ></textarea>
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
  );
}

  