# **Project Name: Community Food Sharing (PlateShare)**
 
### Project Theme You will build a full-stack MERN application called "PlateShare". This platform allows users to share their surplus food with the community to reduce waste. Users can post food items they want to donate, and other users can browse and request these food items. 
---
## You have to do:

- Read and analyze all of this.
- Create a unique, modern, and responsive website design — not the typical Bootstrap or plain layout.
- Use the MERN stack:
- MongoDB for the database
- Express.js for backend APIs
- React.js (Vite preferred) for the frontend
- Node.js as the server runtime
- Implement both frontend and backend fully connected.
- Include environment variables (like database URI) using .env.
- Use modular, scalable folder organization.
- Write clean, and production-ready code.
- Finally, generate the entire project folder structure and code files.

## Output format:

- First, show me the complete file structure.
- Then generate all major code files (server.js, API routes, models, frontend pages, etc.)
- Include setup instructions for local development and deployment.

## Design instructions:

- Use a unique, aesthetic color palette (not default blue/gray).
- Add a nice animated navigation bar, smooth transitions, and clean typography.
- Ensure the layout works perfectly on both desktop and mobile.
- Add small creative elements (like hover effects, subtle animations, or modern cards) that make the website feel professional.
- Don’t use any Lorem ipsum text; you can not use the default alert to show any error or success message.  use tailwind css and daisy ui for desgin.

---

## Live Link: https://plate-share.surge.sh/


## **Main Requirements** 


1. ### **Layout Structure**

You will have a main layout consisting of a Navbar and a Footer.

* #### **Navbar (Navigation Bar)**

  * **If User is Not Logged In:**  
    * Website Logo & Name  
    * Home  
    * Available Foods  
    * Login (Button)  
  * **If User is Logged In:**  
    * Website Logo & Name  
    * Home  
    * Available Foods  
    * User Profile Image (Dropdown Menu)  
      * Add Food (Private)  
      * Manage My Foods (Private)  
      * My Food Requests (Private)  
      * Logout (Button)

* #### **Footer**

  * A standard website footer.  
  * Must include: Website Logo & Name, Copyright text, and Social Media Links.


2. ### **Home Page**

   **Banner/Hero Section:** A visually appealing banner with a title, a short description of the platform, and a "Search Food" button (or "View All Foods" button).

   **Dynamic Section (Featured Foods):**

* This section will dynamically load and display 6 food items from the database. **Logic:** It should show the 6 food items with the *highest food quantity* (e.g., "Serves 5 people" \> "Serves 2 people").  
* Each card must have a "View Details" button.

  **"Show All" Button:** After the Featured Foods section, there must be a "Show All" button that navigates the user to the "Available Foods" page.

  **Two Extra Static Sections:**

* You must add two additional static sections. For example:  
  1. A "How It Works" section (explaining the 3-step process: Post Food, Find Food, Collect Food).  
  2. An "Our Mission" or "Community Stats" section.

3. ### **Authentication**

 You must implement Firebase authentication.

* #### **User Registration**

  * Create a register page with a form.  
  * **Form Fields:** Name, Email, Photo-URL, Password, Register Button.  
  * **Password Validation:** Implement and show errors in the form if the password criteria are not met:  
    * Must have an Uppercase letter.  
    * Must have a Lowercase letter.  
    * Length must be at least 6 characters.  
  * Show a success toast/message on successful registration and navigate to the Home page.  
  * Show an error toast/message if registration fails.  
  * **Social Login:** Add a "Login with Google" button.  
  * Add a link to the Login page for existing users.

* #### **User Login**

  * Create a Login page with a form.  
  * **Form Fields:** Email, Password, Login button.  
  * On successful login, navigate the user to their desired route or the Home page.  
  * Show an error toast/message if login fails.  
  * **Social Login:** Add a "Login with Google" button.  
  * Add a link to the Register page for new users.

💡Don’t implement email verification or the forget password method, as it will inconvenience the examiner. If you want, you can add these after receiving the assignment result.

4. ### **CRUD Operation (Food Management):** 

All data must be stored in a MongoDB Database. You will create a **`foods`** 

## 🗄️ MongoDB Configuration
MONGO_URI=mongodb+srv://nahianmaksood04_db_user:hZFKN68Arx5BVi4g@cluster0.clw894c.mongodb.net/plateshare?appName=Cluster0

The backend should connect to this database using **Mongoose**.  
All collections (like `foods` and `requests`) should be created under the **plateshare** database.

* #### **Add Food (Create \- Private Route):**

  * Create an "Add Food" page accessible only to logged-in users.  
  * Create a form that takes the following inputs:  
    * Food Name  
    * Food Image (must use **imgbb** for image hosting)  my imgbb api key 'a905e0300948f960f56f8ffd857e3b4e'
    * Food Quantity (e.g., "Serves 2 people")  
    * Pickup Location  
    * Expire Date (use a date picker)  
    * Additional Notes (textarea)  
  * **Auto-filled Data:** Automatically add the Donator's Info (Name, Email, Image) from the logged-in Firebase user.  
  * **Default Status:** Set the default **`food_status`** to "Available".  
  * On successful submission, save the data to the **`foods`** collection in MongoDB and show a success toast.

* #### **Available Foods (Read \- Public Route):**

  * This page will be accessible to all users.  
  * It must fetch and display all food items where the **`food_status`** is "Available".  
  * Display the foods in a 2 or 3-column card grid.  
  * **Each card must show:** Food Image, Food Name, Donator Name & Image, Food Quantity, Pickup Location, and Expire Date.  
  * Each card must have a "View Details" button. If a non-logged-in user clicks it, they must be redirected to the Login page.

* #### **Food Details (Read \- Private Route):**

  * Route: **`/food/:id`**  
  * This page is private. If not logged in, the user should be redirected to Login.  
  * Display all details for the selected food item, including Donator Info and Additional Notes.  
  * There must be a "Request Food" button. Functionality describes on the challenge section.

* #### **Manage My Foods (Update & Delete \- Private Route):**

  * This page is private and will show a list or table of *only* the foods added by the currently logged-in user (filter by donator email).  
  * **Update:** Each item must have an "Update" button. Clicking it should:  
    * Open a Modal OR navigate to a new page (**`/update-food/:id`**).  
    * The form must be pre-filled with the existing data for that food item.  
    * The user can edit the information and submit it to update the document in MongoDB.  
  * **Delete:** Each item must have a "Delete" button. Clicking it should show a confirmation prompt (e.g., SweetAlert) before deleting the document from the database.

5. ### **Other Requirements** 

* **Loading:** Add a loading spinner or skeleton loader that displays while data is being fetched on pages like "Available Foods" and "Manage My Foods".  
* **Error Page:** Create a 404 Error Page. It should include a relevant image/GIF and a "Back to Home" button.

**UI Design Requirements:** 

* **Unique Design:** First, decide what kind of website you want to make. Then, search online or check out websites like ThemeForest to get ideas for the design. But remember, your website idea shouldn't be similar to any projects you've done before or to any examples in our modules or conceptual sessions.  
. 

1. Keep the main heading style (font, size, color) consistent across all sections.
2. Keep paragraph spacing balanced and text easily readable.  
3. Maintain uniform image sizes and spacing.
4. Use the same button style as on the home page.
5. Ensure good spacing and proper alignment.  
6. Navbar, Keep the heading/logo same style and size as on the home page.  
7. Use a grid layout with equal image sizes.  
8. Keep all cards equal height and width (especially in services, projects, or products section)  
9. Use the new X logo instead of the old Twitter bird to match the latest rebrand  
10. Responsiveness: Make it responsive for all devices, including mobile, tablet, and desktop views. 

## Firebase Auth
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZemlC5gWk_nwuLWn-kwGO03cGtdOY-sA",
  authDomain: "plate-share-70dc7.firebaseapp.com",
  projectId: "plate-share-70dc7",
  storageBucket: "plate-share-70dc7.firebasestorage.app",
  messagingSenderId: "822622902825",
  appId: "1:822622902825:web:d7c15b56fe76274a209a38"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

Include environment variables for firebase configuration using .env.


## Firebase Admin config


{
  "type": "service_account",
  "project_id": "plate-share-70dc7",
  "private_key_id": "f1990c69799faa6f15be31fd4ffd11daa6f0430e",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCJ/kYV/IN0B38X\nfw528jakQWTLv1VuRbnrL1kK8Bmd8bQmReo/0QDGPCoHtlHm3Pz6+b3J+WWXrI4H\nPZOA6axoR80LVF9D11nm0wwI5P37FXJRUmfOGp946fW35ekbdEYGq0JM4RMRQEao\n4frznCHjhEKpoPkbH7rBA1fm35/atENcDQT3lGG3lTIvdfcCdbnk3eZnMAgOHDE5\nyE4Q6QeIXefsfuhAnPCQneHfSn8P7RkX1YSdHqRWClJqPZVG2Toql88Sl5+UT8MO\nIZaGjlU/1IFa1GAdWu3cSVgcmDCxh1GYEkXSow8YDjHXOnfZGCvfEKioRPhZ2ZBv\nj4PC2yp3AgMBAAECggEAFFsNdKXUsFOAxHMKK7KsK8u3tjSJwiQH+nD4Fhx38uwa\nMoEivnoyvotWed/DsiYMLWuUuwwOl/Ks2tWTAjO2KoXY8eBm0yeby+h7AH7jFlxC\nCkv5IxabSqdch12jZtjekZJGy/dxrBxKsBPxxGjWOO0kNkiYJo+mKV24ZEa9mnHA\nd/9inVcF9Q3cZygPKtk/7CIJfHNV6goLmg+wKqyeaMu7LQA1EfPdxvyLgkhSUxXq\nukCeVF5ciKvPOc2xhI/HGUdwRasnBRisQRGBTCjjRKc1XX5eChNmskIqVEZWLP9O\nZ8uZgFcRhUmGRSE8S8jIKSq+yabhpqFzJeaQG3v5GQKBgQDCiYe7YocjDcLSR8gC\ndGtCtolu4l1cYtOCqieLAp+bWXwOme6GfFjR7gLhp8neQMYbhwDglyciwi1kADQe\nBxkOmyIrZKpLUAtbwqhxTBRiBdIMRZKQEqfSG9JDBWBocjUSqjBhaFCNo8jorOcM\ntuMBNKKGxrxdm+l/LGB3yoKnjwKBgQC1l2FgfsBj/EzO6SMOfrKYnZ1/MtFPd6Xn\nFK9HyvdDw1CXTPCi9RWj7bV0eH1ymmxcbXTwJ69FHy5SYADFjuthzdwargj04J22\nfdUMqdXJSy7MZaVJI3Xg2uITDaQMiBp0O1MMd/ibr9m73IasZOxVZLJEj1VvqGty\nIclLmfeamQKBgF0AaN5hjR9p/cCPxoO96mVbZLqZB28aY+mstPjVCT64egF0/75V\nhhTeh4wfrfdN2ifg07+LI4+PaynKmx/b3tPHwH8kQfF9U+DLX8HCUGBIThHF1PqB\noK9m049s65kjOFIzAKwgtZnxOiRaPJ8sc7vo0OZD7luGJQvCSGAcdXfrAoGAQgXs\nLb1oDfJpqsExMc/29243GUxMtev2sfHfWOb+x/B3mMssotMhLxz6YIJ+efCTfXd+\nkOKc4zDXErQ9E5dHFaRXZovoTcBtFzDhCV2mkS14snAyjEkMTtjGYc8P2k6R77iy\nFVJ5XYGuVJN1k7CODO4zsqG6moJNro2CNq6gS+ECgYEAm4jFNHI6kmR477ZDKwEB\n7Oc9dOpjklXnjlR06ke/R5T+J3edrI2jNPYK4JhjAUikHoxC7vpyC7Bam2iAdazF\nCVB7FBVVvuQ4h5I1+5v7Yhz1yDev3jbzJbDX0scrlbSEQXCMGX04KvCctSObEWx0\nZTPq6dcmmhVotuW14qyRVQ8=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@plate-share-70dc7.iam.gserviceaccount.com",
  "client_id": "107158110460252156147",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40plate-share-70dc7.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}




### **Food Request System**

Create a Food Request System. So that Anyone can request food and foodOwner can Select and Deliver Food to a person. 

#### **Food Request Submissions**

- On Food Details page there will be a **request food** Button   
- On Click Show a Modal with a Form that includes to fields   
  - Write Location ( text \- input )   
  - Why Need Food ( Text Area )   
  - Contact No.   
  - Submit Request Button  
- On Submit ,  Save the Request data with userEmail , name , photoURL , \_Id of the food  and a status: pending  into a different collection 

#### **Food Requests Table**

- Show a Food Request Table below the Food Details page  
- Only Food Owner will show the Food Request Table    
- Show all the requests for the specific food in a table with all the data  
- Show 2 button in each Row Accept /  Reject  
  - On Clicking Accept   
    - Request status will be changed to accepted   
    - Food Status will be changed to donated   
  - On clicking Reject   
    - Request status will be changed to Rejected

### **Animation in the Homepage**

Implement Animation using framer-motion / react-spring /  data-aos npm packages in the Homepage

* Use **TanStack Query** for all data fetching, caching, and state management.  
* Use **react-hook-form** for handling all forms (Login, Register, Add Food, Update Food).  
* Implement **“Firebase Access Token” middleware** to protect , POST,  Patch and delete requests.


# Generate full code all at once.