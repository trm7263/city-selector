# City Selector

A React component that allows the user to select a city via a typeahead search.

Install packages with `npm i` and then run with `npm start`.

# Things I would have liked to do

I tried to keep true to the timebox, and as such there are things I was not able to accomplish.

* I was not able to take advantage of my `getCity()` method to get the city data for preferred cities upon loading the component. I had tried to asynchonously loop through the preferred cities response and get the city for each id in the array, but I was not happy with this and ran into issues.
* Because of all the requests that get made while using this component, there can be some issues with how long actions take to get feedback. I added a loading spinner to help with the experience, but even with that I found some things that took a while.
* Sometimes during typing, an older string's request will be the last one to finish, making the list not 100% accurate.
* I would have liked to thoroughly test my component with unit tests. I like to create tests initially if possible, and then build a method to conform to it, but the nature of how this exercise came together didn't lend itself to that strategy. Given more time, I would have tested the component extensively and cleaned up some of the messier logic.