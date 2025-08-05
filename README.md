# Purchase
Purchase: Cart, Form, Overview" page, "Checkout Complete" page. WebdriverIO, JavaScript
Step 1: Click on the "Add to cart" button near any product   Expected result: Number near the cart at the top right increase by 1, product is added to cart

Step 2: Click on the "Cart" button at the top right corner   Expected result: Cart page is displayed, product are the same as was added at step 1

Step 3: Click on the "Checkout" button   Expected result: Checkout form are displayed

Step 4: Fill the "First Name" field with valid data   Data: Any random First Name   Expected result: Data is entered to the field

Step 5: Fill the "Second Name" field with valid data   Data: Any random Second Name   Expected result: Data is entered to the field

Step 6: Fill the "Postal Code" field with valid data   Data: Any random Postal Code   Expected result: Data is entered to the field

Step 7: Click on the "Continue" button   Expected result: User is redirected to the "Overview" page, Products from step 1 is displayed. Total price = price of products from step 1

Step 8: Click on the "Finish" button   Expected result: User is redirected to the "Checkout Complete" page, "Thank you for your order!" message are displayed

Step 9: Click on the "Back Home" button   Expected result: User is redirected to the inventory page. Products are displayed. Cart is empty
