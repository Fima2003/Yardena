let memories = []; // This will now hold the data from memoriesData
let currentMemoryIndex = 0;
let map; // Single map instance

document.addEventListener("DOMContentLoaded", () => {
  // No form to listen to anymore
  // const memoryForm = document.getElementById('memoryForm'); // Remove this line

  const memoryDisplayContainer = document.querySelector(
    ".memory-display-container"
  );
  const memoryDisplay = document.getElementById("memoryDisplay");
  const currentMapElement = document.getElementById("currentMap");

  // Assign the hardcoded data to the 'memories' array
  memories = [...memoriesData]; // Use spread operator to copy the array

  // Immediately render memories and initialize map with the first item
  renderMemories();
  if (memories.length > 0) {
    initMap(); // Call initMap directly, it will use memories[0]
    updateCurrentMap(); // Ensure the map and pin are set for the first item
  }

  function renderMemories() {
    memoryDisplay.innerHTML = ""; // Clear previous memories
    memories.forEach((memory, index) => {
      const memoryItem = document.createElement("div");
      memoryItem.classList.add("memory-item");
      memoryItem.dataset.index = index; // Store index for easy access

      const img = document.createElement("img");
      img.src = memory.fileName;
      img.alt = "Memory Image";
      memoryItem.appendChild(img);

      const noteParagraph = document.createElement("p");
      noteParagraph.textContent = memory.imageDescription;
      memoryItem.appendChild(noteParagraph);

      memoryDisplay.appendChild(memoryItem);

      memoryItem.addEventListener("click", () => {
        currentMemoryIndex = index;
        updateCurrentMap();
        scrollToCurrent();
      });
    });
  }

  function scrollToCurrent() {
    const currentItem = memoryDisplay.querySelector(
      `.memory-item:nth-child(${currentMemoryIndex + 1})`
    );
    if (currentItem) {
      // Use scrollIntoView to center the element
      currentItem.scrollIntoView({
        behavior: "smooth", // For a smooth scrolling effect
        inline: "center", // To center the element horizontally
      });

      // Optional: Add a class to highlight the current item
      memoryDisplay.querySelectorAll(".memory-item").forEach((item) => {
        item.classList.remove("active-memory-item");
      });
      currentItem.classList.add("active-memory-item");
    }
  }

  // Google Maps API callback function (called by the API script)
  // No direct call needed here, as it's triggered by the Google Maps script
  // when the API is ready. `initMap()` below will be called.
});

// This `initMap` function is the global callback for Google Maps API.
// It will be called when the Google Maps script loads.
function initMap() {
  const currentMapElement = document.getElementById("currentMap");
  if (currentMapElement && memories.length > 0) {
    const initialLocation = {
      lat: memories[currentMemoryIndex].latitude,
      lng: memories[currentMemoryIndex].longitude,
    };
    const mapOptions = {
      zoom: 12,
      center: initialLocation,
      fullscreenControl: false,
      mapTypeControl: false,
      streetViewControl: false,
    };
    map = new google.maps.Map(currentMapElement, mapOptions);
    map.markers = []; // Initialize markers array

    // Add the initial marker
    const initialMarker = new google.maps.Marker({
      position: initialLocation,
      map: map,
      title: "Current Memory Location",
    });
    map.markers.push(initialMarker);

    // Ensure the initial item is highlighted
    const memoryDisplay = document.getElementById("memoryDisplay");
    if (memoryDisplay) {
      const firstItem = memoryDisplay.querySelector(
        `.memory-item:nth-child(1)`
      );
      if (firstItem) {
        firstItem.classList.add("active-memory-item");
      }
    }
  }
}

function updateCurrentMap() {
  if (map && memories.length > 0 && memories[currentMemoryIndex]) {
    const newLocation = {
      lat: memories[currentMemoryIndex].latitude,
      lng: memories[currentMemoryIndex].longitude,
    };

    // Remove the old marker
    if (map.markers && map.markers[0]) {
      map.markers[0].setMap(null);
    }

    // Create a new marker and set its position
    const newMarker = new google.maps.Marker({
      position: newLocation,
      map: map,
      title: "Current Memory Location",
    });

    // Update the map's center and the marker array
    map.setCenter(newLocation);
    map.markers = [newMarker];
  }
}
