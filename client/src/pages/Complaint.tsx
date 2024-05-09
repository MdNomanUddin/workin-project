import { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
//import { useNavigate } from "react-router-dom";
import axios from "axios";
import { notifyError, notifySuccess } from "./notification";

export default function Complaint() {
  const [location, setLocation] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  //const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [severity, setSeverity] = useState(0);
  const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  const [hasPotholes, setHasPotholes] = useState<boolean | null>(null); // Stores the pothole detection result (True/False)
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  const handleImageChange = async (e: any) => {
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

      // Process the image immediately after upload
      await processImage(selectedImage);
    }
  };

  const processImage = async (selectedImage: File) => {
    try {
      const formData = new FormData();
      formData.append("file", selectedImage);

      const response = await axios.post(
        "http://127.0.0.1:5000/hasPotholes",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data.has_potholes);
      // Handle response for pothole detection
      if (response.data.has_potholes === true) { // Assuming "True" indicates potholes
        setHasPotholes(true);
        // Check if the API response includes a processed image (e.g., base64 encoded)
        if (response.data.hasOwnProperty("image_base64")) {
          setProcessedImage(response.data.image_base64);
        }
      } else {
        notifyError("No potholes detected. Please try again!");
        resetImageState();
      }
    } catch (error) {
      console.error("Error processing image:", error);
      notifyError("Failed to process the image. Please try again.");
      resetImageState();
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (hasPotholes === null || hasPotholes === false) {
      notifyError("Please upload an image with potholes detected.");
      resetImageState();
      return;
    }
    // Check if image is not null before proceeding
    if (image === null) {
      notifyError("Please upload an image.");
      resetImageState();
      return;
    }

    try {
      if (processedImage === null) {
        notifyError("Failed to upload processed image.");
        resetImageState();
        return;
      }
      const processedImagePath = await uploadImage(processedImage);
      console.log("Processed image uploaded successfully:", processedImagePath);

      // Save complaint details in Firestore
      await saveComplaint(processedImagePath);
      // Reset form values
      resetFormState();
    } catch (error) {
      console.error("Error submitting complaint:", error);
      notifyError("Failed to submit complaint. Please try again.");
      resetFormState();
    }
    resetFormState();
  };

  const uploadImage = async (imageData: string): Promise<string> => {
    const storage = getStorage();
    const imageRef = ref(storage, `processed_images/${generateComplaintId()}.png`);

    try {
      // Convert the base64 encoded image data to a Blob
      const byteCharacters = atob(imageData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });

      // Upload the processed image to Firebase Storage
      await uploadBytes(imageRef, blob);

      // Get the downloadable URL of the uploaded image
      const downloadURL = await getDownloadURL(imageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading processed image:", error);
      throw error;
    }
  };
  const saveComplaint = async (imagePath: string) => {
    // Save complaint details in Firestore
    try {
      // Assuming Firebase Authentication is set up
      const user = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
      const userName = user.name || "Anonymous"; // Use display name if available
      const userEmail = user.email || null;
      const fullComplaintId = generateComplaintId();

      // Extract ID without prefix for database storage
      const complaintId = fullComplaintId;
      const currentDate = new Date();
      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "June",
        "July", "Aug", "Sept", "Oct", "Nov", "Dec"
      ];

      const formattedDate = `${currentDate.getDate()} ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
      const complaintData = {
        userName,
        userEmail,
        location: location,
        severity: severity,
        description,
        complaintId,
        imagePath,
        dateReported: formattedDate,
      };

      await addDoc(collection(db, "complaints"), complaintData);
      console.log("Complaint added successfully:", complaintData);
      notifySuccess("Complaint submitted successfully");
      resetFormState();

    } catch (error) {
      console.error("Error adding complaint:", error);
      notifyError("Failed to submit complaint. Please try again.");
    }
    resetFormState();
  };

  const generateComplaintId = () => {
    // Generate a unique 8-digit complaint ID
    const randomId = Math.floor(10000000 + Math.random() * 90000000);
    return `C${randomId.toString().substring(0, 7)}`;
  };
  

  const resetFormState = () => { // resets all values after successful submission of form
   resetImageState();
    setDescription("");
    setLocation("");
    setSeverity(0);

  };

  const resetImageState = () => {  // resets image state if errors occurs related to uploaded image
    if(fileInput){
      fileInput.value = '';
    }
    console.log("reseting image states");
    setImage(null);
    setImageUrl(null);
    setHasPotholes(null);
    setProcessedImage(null);

  }

  return (
    <div>
      <h2>Submit a Complaint</h2>
      <form onSubmit={handleSubmit}>
        <label>Image:</label>
        <input type="file" id="fileInput" name="file" accept="image/*" onChange={handleImageChange} />
        <div className="flex items-center ">
          <div >
            {imageUrl && hasPotholes !== null && hasPotholes && (

              <img
                src={imageUrl}
                alt="Selected Image"
                className="mt-2 max-w-xs h-64 rounded-md"
              />
            )}
          </div>

          {/* Display the processed image */}
          <div>
            {hasPotholes && processedImage && (
              <img
                src={`data:image/png;base64,${processedImage}`}
                alt="Processed Image"
                className="mt-2 max-w-xs h-64 rounded-md"
              />
            )}
            {hasPotholes !== null && !hasPotholes && (
              <p>No potholes detected in the uploaded image.</p>
            )}
          </div>
        </div>

        <div>
          <label>Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder=" Add a Location"
            required
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
            required
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
        <button type="submit" disabled={hasPotholes === null || !hasPotholes}>Submit</button>
      </form>
    </div>
  );
}

