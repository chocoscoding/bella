export const restaurant = {
  name: 'Bella Cucina Mexican',
  order: '/order',
  /** Full menu: the online ordering page, fed live from Clover. */
  menu: '/order',
  catering: '/catering',
  blog: '/blog',
  phone: '(540) 412-5009', phoneHref: 'tel:+15404125009',
  address: '4444 Germanna Highway', locality: 'Locust Grove, VA 22508',
  city: 'Locust Grove', region: 'VA', postalCode: '22508',
  directions: 'https://www.google.com/maps/dir/?api=1&destination=Bella+Cucina+Mexican+4444+Germanna+Highway+Locust+Grove+VA',
  hours: [
    ['Monday – Saturday', '11:00 am – 10:00 pm'],
    ['Sunday', '11:00 am – 9:00 pm'],
  ],
  /** Machine-readable copy of `hours`, used for structured data. Keep the two in step. */
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '11:00', closes: '22:00' },
    { days: ['Sunday'], opens: '11:00', closes: '21:00' },
  ],
};
export const dishes = [
  {name:'Tacos', group:'Tacos & more', file:'tacos', note:'The first delicious decision', description:'Warm tortillas, fresh cilantro and a squeeze of lime.', color:'#edb7cf'},
  {name:'Loaded nachos', group:'To share', file:'nachos', note:'For the middle of the table', description:'Golden chips, melted cheese and generous toppings.', color:'#ffc629'},
  {name:'Shrimp & rice', group:'From the grill', file:'shrimp', note:'Bring a little heat', description:'Saucy shrimp, rice and fresh accompaniments.', color:'#b9c8ee'},
  {name:'Burrito el Grande', group:'Tacos & more', file:'burrito', note:'Bring an appetite', description:'A generous burrito with rice, beans and pico de gallo.', color:'#b7ca79'},
  {name:'Enchiladas', group:'Tacos & more', file:'enchiladas', note:'Saucy and piled high', description:'Smothered in sauce, with lettuce, cheese and rice.', color:'#d0b9e8'},
  {name:'Grilled chicken', group:'From the grill', file:'grilled-chicken', note:'Golden and saucy', description:'Grilled chicken, cilantro, rice and vegetables.', color:'#f3af83'},
  {name:'Steak Mexicano', group:'From the grill', file:'steak-mexicano', note:'For the big appetite', description:'Steak with grilled onions, peppers, rice and beans.', color:'#bbd9d0'},
  {name:'Fiesta chicken salad', group:'Something fresh', file:'chicken-salad', note:'Crisp, cool, avocado on top', description:'Grilled chicken, avocado, tomato and cucumber.', color:'#d7d6a6'},
  {name:'Carnitas', group:'From the grill', file:'carnitas', note:'Golden and tender', description:'Golden pork, rice, beans and tortillas.', color:'#ecb9c7'},
];
