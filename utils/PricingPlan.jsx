// import { CircleCheck } from "lucide-react";

// export default [
//     { 
//         //  link:'https://buy.stripe.com/test_4gw6qRbTJ5gz8sU9AA',
// price:0.00,
// // priceId:'price_1QbpRsRk9dOWYXO8ZjZ200a5',
//  duration:'lifetime',
//  offering:[
//     {value:  <CircleCheck /> + 'Create 3 free mock Interview'},
//     {value:  <CircleCheck /> + 'Unlimited Retake Interview'}
//  ]
//         },

//         { 
//             link:'https://buy.stripe.com/test_4gw6qRbTJ5gz8sU9AA',
//    price:5.00,
//    priceId:'price_1QbpRsRk9dOWYXO8ZjZ200a5',
//     duration:'monthly',
//     offering:[
//         {value:  <CircleCheck /> + 'Create 3 free mock Interview'},
//         {value:  <CircleCheck /> + 'Unlimited Retake Interview'}
//     ]
    
//            }
// ]

// 

import { CircleCheck } from "lucide-react";

export default [
  {
    price: 0.0,
    duration: "lifetime",
    offering: [
      { type: "check", text: "Create 3 free mock interviews" },
      { type: "check", text: "Unlimited Retake Interview"

       },
       { type: "cross", text: "Practise Question"},
       {type: "cross", text: " Exclusive App Access"},
       {type: "cross", text: "Email Support"},
    ],
  },
  {
    price: 5.0,
    duration: "monthly",
    link: "https://buy.stripe.com/test_4gw6qRbTJ5gz8sU9AA",
    priceId: "price_1QbpRsRk9dOWYXO8ZjZ200a5",
    offering: [
      { type: "check", text: "Create unlimited mock interviews" },
      { type: "check", text: "Unlimited Retake Interview" },
      { type: "check", text: "Practise Question"},
       {type: "check", text: "Exclusive App Access"},
       {type: "check", text: "Email Support"},
    ],
  },
];
