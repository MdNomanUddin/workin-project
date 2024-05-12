import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { notifyError } from "./notification";
import submissionImage from "../assets/images/submission.png";
import verificationImage from "../assets/images/search.png";
import workingImage from "../assets/images/work-in-progress.png";
import completedImage from "../assets/images/completed-task.png";

export default function Status() {


  interface ComplaintDataType {
    complaintId?: string;
    description?: string;
    userName?: string;
    dateReported?: string;
    assignedEngineer?: string;
    status?: string;
  }

  const [complaintId, setComplaintId] = useState("");
  const [description, setDescription] = useState("");
  const [loggedInUser, setLoggedInUser] = useState("");
  const [complaintData, setComplaintData] = useState<ComplaintDataType>({}); // State to store all fetched complaintData details


  useEffect(() => {
    // Get user email from local storage
    const user = JSON.parse(localStorage.getItem("loggedInUser") || "");
    const userEmail = user.email;
    setLoggedInUser(userEmail);
  }, []);

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const complaintsRef = collection(db, "complaints");
      const complaintsQuery = query(
        complaintsRef,
        where("complaintId", "==", complaintId),
        where("userEmail", "==", loggedInUser)
      );
      const querySnapshot = await getDocs(complaintsQuery);

      if (querySnapshot.empty) {
        notifyError("Invalid Complaint ID");
        setComplaintId("");
        setDescription("");
        setComplaintData({}); // Reset complaintData details
        return;
      }

      querySnapshot.forEach((doc) => {
        const complaintData = doc.data() as ComplaintDataType; // Type assertion for safety
        setDescription(complaintData?.description ?? "Not available");
        console.log(complaintData);
        setComplaintData(complaintData);
        setComplaintId("");

      });
    } catch (error) {
      console.error("Error searching complaints by ID:", error);
    }
  };

  return (
    <div className="flex flex-col items-center  bg-gray-200 h-screen">
      <div className="flex flex-col  space-y-2 my-10 border-indigo-200 py-2">
        <h2 className="text-2xl font-semibold leading-tight tracking-wide my-2">Track Your Pothole Complaint Status</h2>
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            value={complaintId}
            onChange={(e) => setComplaintId(e.target.value)}
            placeholder="Enter complaint ID"
            className="bg-white-200 appearance-none border-2 border-gray-200-md rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-400"
          />

          <p className="flex items-center gap-1 mt-2 font-sans text-sm antialiased font-normal leading-normal text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 -mt-px">
              <path fill-rule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clip-rule="evenodd"></path>
            </svg>
            Please enter the unique complaint ID provided to you after submission
          </p>
          <div className="flex justify-center my-2">          
            <button type="submit" className=" mx-auto w-1/3 px-6 py-2 font-semibold rounded-md text-gray-50 bg-purple-600" >Search</button>
          </div>
        </form>
      </div>
      
      {description && (

        <div className="bg-gray-100 rounded-md shadow-md flex w-2/3 h-9/12">
          <ol className="flex items-center w-full  text-xs text-gray-900 font-medium sm:text-base">



            {complaintData.status === 'Submitted' && (
              <div className=" flex flex-grow justify-center h-full">
              <div className=" rounded-md shadow-md bg-white p-6 w-full flex flex-col items-center gap-4">
                <img src={submissionImage} alt="Report now image" className="w-24 h-24 rounded-md object-cover" />
                <p className="text-center text-gray-600">The pothole report has been submitted and is awaiting review.</p>
                <div className="flex w-full items-center justify-center">
                <li className="flex w-full relative text-indigo-600 after:content-[''] after:w-full after:h-1 after:bg-indigo-600 after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-4">
                  <div className="block whitespace-nowrap z-10">
                    <span className="w-6 h-6 bg-indigo-600 border-2 border-transparent rounded-full flex justify-center items-center mx-auto mb-3 text-lg text-white lg:w-10 lg:h-10">1</span>
                    <p>Report Submitted</p>
                  </div>
                </li>
                <li className="flex w-full relative text-gray-900 after:content-[''] after:w-full after:h-1 after:bg-gray-200 after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-4">
                  <div className="block whitespace-nowrap z-10">
                    <span className="w-6 h-6 bg-indigo-50 border-2 border-indigo-600 rounded-full flex justify-center items-center mx-auto mb-3 text-lg text-indigo-600 lg:w-10 lg:h-10">2</span>
                    <p  className="text-gray-700"> Verification Stage</p>
                  </div>
                </li>
                <li className="flex w-full relative text-gray-900 after:content-[''] after:w-full after:h-1 after:bg-gray-200 after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-4">
                  <div className="block whitespace-nowrap z-10">
                    <span className="w-6 h-6 bg-gray-50 border-2 border-gray-200 rounded-full flex justify-center items-center mx-auto mb-3 text-lg lg:w-10 lg:h-10">3</span>
                    <p  className="text-gray-700"> Working </p>
                  </div>
                </li>
                <li className="flex w-full relative text-gray-900 ">
                  <div className="block whitespace-nowrap z-10">
                    <span className="w-6 h-6 bg-gray-50 border-2 border-gray-200 rounded-full flex justify-center items-center mx-auto mb-3 text-lg lg:w-10 lg:h-10">4</span>
                    <p  className="text-gray-700"> Completed </p>
                  </div>
                </li>
                </div>
                </div>
              </div>
            )}
            {complaintData.status === 'Verification' && (
              <div className=" flex flex-grow justify-center h-full ">
                <div className=" rounded-md shadow-md bg-white p-6 w-full flex flex-col items-center gap-4">
                  <img src={verificationImage} alt="Report now image" className="w-24 h-24 rounded-md object-cover" />
                  <p className="text-center text-gray-600">The report is under review to confirm the existence and location of the pothole.</p>
                  <div className="flex w-full items-center justify-center overflow-visible">

                    <li className="flex w-2/6 relative text-indigo-600 after:content-[''] after:w-full after:h-1 after:bg-indigo-600 after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-4">
                      <div className="block whitespace-nowrap z-10">
                        <span className="w-8 h-8 bg-indigo-600 border-2 border-transparent rounded-full flex justify-center items-center mx-auto mb-3 text-lg text-white lg:w-10 lg:h-10">1</span>
                        <p>Report Submitted</p>
                      </div>
                    </li>
                    <li className="flex w-2/6 relative text-indigo-600 after:content-[''] after:w-full after:h-1 after:bg-indigo-600 after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-4">
                      <div className="block whitespace-nowrap z-10">
                        <span className="w-8 h-8 bg-indigo-600 border-2 border-transparent rounded-full flex justify-center items-center mx-auto mb-3 text-lg text-white lg:w-10 lg:h-10">2</span>
                        <p > Verification Stage</p>
                        
                      </div>
                    </li>
                    <li className="flex w-2/6 relative text-gray-900 after:content-[''] after:w-full after:h-1 after:bg-gray-200 after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-4 overflow-visible">
                      <div className="block whitespace-nowrap z-10 overflow-visible">
                        <span className="w-8 h-8 bg-indigo-50 border-2 border-indigo-600 rounded-full flex justify-center items-center mx-auto mb-3 text-lg text-gray-700 lg:w-10 lg:h-10">3</span>
                        <p  className="text-gray-700"> Working</p>
                        
                      </div>
                    </li>
                    <li className="flex w-1/6 relative text-gray-900  ">
                      <div className="block whitespace-nowrap z-10">
                        <span className="w-8 h-8 bg-gray-50 border-2 border-gray-200 rounded-full flex justify-center items-center mx-auto mb-3 text-gray-700 text-lg lg:w-10 lg:h-10">4</span>
                        <p  className="text-gray-700"> Completed </p>
                      </div>
                    </li>
                  </div>
                </div>
              </div>
            )}

            {complaintData.status === 'Working' && (
             <div className=" flex flex-grow justify-center h-full">
             <div className=" rounded-md shadow-md bg-white p-6 w-full flex flex-col items-center gap-4">
               <img src={workingImage} alt="Report now image" className="w-24 h-24 rounded-md object-cover" />
               <p className="text-center text-gray-600">Repair work for the reported pothole is currently underway.</p>
               <div className="flex w-full items-center justify-center">
                <li className="flex w-full relative text-indigo-600 after:content-[''] after:w-full after:h-1 after:bg-indigo-600 after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-4">
                  <div className="block whitespace-nowrap z-10 ">
                    <span className="w-6 h-6 bg-indigo-600 border-2 border-transparent rounded-full flex justify-center items-center mx-auto mb-3 text-lg text-white lg:w-10 lg:h-10">1</span>
                    <p>Report Submitted</p>
                  </div>
                </li>
                <li className="flex w-full relative text-indigo-600 after:content-[''] after:w-full after:h-1 after:bg-indigo-600 after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-4">
                  <div className="block whitespace-nowrap z-10">
                    <span className="w-6 h-6 bg-indigo-600 border-2 border-transparent rounded-full flex justify-center items-center mx-auto mb-3 text-lg text-white lg:w-10 lg:h-10">2</span>
                    <p> Verification Stage</p>
                  </div>
                </li>
                <li className="flex w-full relative text-indigo-600 after:content-[''] after:w-full after:h-1 after:bg-indigo-600 after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-4">
                  <div className="block whitespace-nowrap z-10">
                    <span className="w-6 h-6 bg-indigo-600 border-2 border-transparent rounded-full flex justify-center items-center mx-auto mb-3 text-lg text-white lg:w-10 lg:h-10">3</span>
                    <p  className="text-gray-700"> Working </p>
                  </div>
                </li>
                <li className="flex w-full relative text-gray-900 ">
                  <div className="block whitespace-nowrap z-10">
                    <span className="w-6 h-6 bg-indigo-50 border-2 border-indigo-600 rounded-full flex justify-center items-center mx-auto mb-3 text-lg text-indigo-600 lg:w-10 lg:h-10">4</span>
                    <p  className="text-gray-700"> Completed </p>
                  </div>
                </li>
                </div>
                </div>
              </div>
            )}

            {complaintData.status === 'Completed' && (
             <div className=" flex flex-grow justify-center h-full">
             <div className=" rounded-md shadow-md bg-white p-6 w-full flex flex-col items-center gap-4">
               <img src={completedImage} alt="Report now image" className="w-24 h-24 rounded-md object-cover" />
               <p className="text-center text-gray-600">The reported pothole has been repaired successfully.</p>
               <div className="flex w-full items-center justify-center">
                <li className="flex w-full relative text-indigo-600 after:content-[''] after:w-full after:h-1 after:bg-indigo-600 after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-4">
                  <div className="block whitespace-nowrap z-10">
                    <span className="w-6 h-6 bg-indigo-600 border-2 border-transparent rounded-full flex justify-center items-center mx-auto mb-3 text-lg text-white lg:w-10 lg:h-10">1</span>
                    <p>Report Submitted</p>
                  </div>
                </li>
                <li className="flex w-full relative text-indigo-600 after:content-[''] after:w-full after:h-1 after:bg-indigo-600 after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-4">
                  <div className="block whitespace-nowrap z-10">
                    <span className="w-6 h-6 bg-indigo-600 border-2 border-transparent rounded-full flex justify-center items-center mx-auto mb-3 text-lg text-white lg:w-10 lg:h-10">2</span>
                    <p> Verification Stage</p>
                  </div>
                </li>
                <li className="flex w-full relative text-indigo-600 after:content-[''] after:w-full after:h-1 after:bg-indigo-600 after:inline-block after:absolute lg:after:top-5 after:top-3 after:left-4">
                  <div className="block whitespace-nowrap z-10">
                    <span className="w-6 h-6 bg-indigo-600 border-2 border-transparent rounded-full flex justify-center items-center mx-auto mb-3 text-lg text-white lg:w-10 lg:h-10">3</span>
                    <p>Working </p>
                  </div>
                </li>
                <li className="flex w-full relative text-indigo-600 ">
                  <div className="block whitespace-nowrap z-10">
                    <span className="w-6 h-6 bg-indigo-600 border-2 border-transparent rounded-full flex justify-center items-center mx-auto mb-3 text-lg text-white lg:w-10 lg:h-10">4</span>
                    <p> Completed </p>
                  </div>
                </li>
                </div>
                </div>
              </div>
            )}
          </ol>




        </div>
      )}
    </div>
  );
}
