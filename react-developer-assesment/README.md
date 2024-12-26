# React Developer Assesment

Welcome to the React Developer Assesment! Please follow the instructions below to complete the task.

## **Project Setup**

1. Clone the repository:
   ```bash
   git clone https://github.com/Bid-Liquidation/react-developer-assesment.git
   cd react-assesment
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Start the development server
   ```
   npm run dev
   ```
4. Open your browser and navigate to the provided URL to see the application.

## Goal

Build a Real-Time Product Search application with the following features:

- State Management
- API Integration
- Routing
- Reusable Components
- Styling (CSS-in-JS or preprocessors like SASS is acceptable)

## Requirements

- Product Listing:

  - Fetch a list of products from the provided api endpoint:
    - Endpoint: https://fakestoreapi.com/products
  - Display the following details:
    - Product Title
    - Product Price
    - Image
    - Category
    - Rating (score and count)
  - Add a search bar to filter products by title
  - Add filters for category and price range (slide or min-max input)
  - Add sorting by price and rating
  - Highlight Matching Text
    - Highlight the part of the product title that matches the search query.
  - Lazy Loading
    - Load products in batches (10 at a time) as the user scrolls down.
  - Persist State:
    - Save search, filter, and sort settings in the browser (localStorage or sessionStorage).

## Evaluation Criteria

- <b>Code Quality:</b> Clean, readable, and reusable components.
- <b>Functionality:</b> All features implemented as described.
- <b>Performance:</b> Efficient state and API management.
- <b>Styling:</b> Aesthetic and responsive UI.
- <b>Problem-Solving:</b> Approach to solving the task.

## Submission

- Fork this repository to your own GitHub account.
- Create a new branch in your forked repository for your work (e.g., feature/task-manager).
- Commit your changes and push them to the new branch.
- Submit the URL of your forked repository and the branch name along with any notes about your implementation.

<br />

Good luck, and happy coding! 🚀
