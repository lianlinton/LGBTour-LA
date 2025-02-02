async function formatRoutes() {
  try {
      const response = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vTru2HBD9f1YWiWpfyMM_IS8bNCHzuHJE5853Tltuj1O6h7yKsAJOujdOwn-b6FfPUk0UbZKMG7gZEv/pub?gid=1143097727&single=true&output=tsv");
      const tsvData = await response.text();
      const rows = tsvData.trim().split("\n");

      // Parsing TSV data
      const parsedRows = rows.map(row => {
          const regex = /"([^"]*)"|([^\t]+)/g;
          const values = [];
          let match;
          while ((match = regex.exec(row)) !== null) {
              const value = match[1] || match[2] || "";
              values.push(value.trim());
          }
          return values;
      });

      // Extract headers properly
      const headers = parsedRows[0]; // Headers already extracted as an array
      const data = parsedRows.slice(1).map(row => {
          let obj = {};
          row.forEach((value, index) => {
              if (headers[index] !== undefined) {
                  obj[headers[index].trim()] = value.trim();
              }
          });
          return obj;
      });

      // Categorize data
      const categorizedData = {};

      data.forEach(item => {
          // Normalize category key (convert to lowercase, remove extra spaces)
          const categoryKey = item.Category ? item.Category.trim().toLowerCase() : "general";

          if (!categorizedData[categoryKey]) {
              categorizedData[categoryKey] = [];
          }

          // Format item with fallback values
          const formattedItem = {
              name: item.Name || "Unnamed Location",
              category: item.Category || "General",
              location: item.Location || "Unknown Location",
              description: item.Description || "No description available",
              lat: parseFloat(item.Latitude) || 0, // Ensure valid number
              lng: parseFloat(item.Longitude) || 0, 
              imgName: item.Image || "img-not-found.png"
          };

          categorizedData[categoryKey].push(formattedItem);
      });

      // Sort each category's array alphabetically by name (with safeguard)
      for (const key in categorizedData) {
          categorizedData[key].sort((a, b) => (a.name && b.name) ? a.name.localeCompare(b.name) : 0);
      }

      return categorizedData;
  } catch (error) {
      console.error("Error fetching or processing the TSV file:", error);
      return {};
  }
}

function createPopUpCard(name, location, description, category, imgName) {
    const popUpContainer = document.getElementById("popup-container");
    const topBar = document.getElementById("topbar");

    // Prevent creating a pop-up if name is empty
    if (name === "") {
        return;
    }

    // Hide the topbar when creating the pop-up
    topBar.style.display = "none";

    // Create a new pop-up card for each click (allowing multiple pop-ups)
    const popUpCard = document.createElement("div");
    popUpCard.classList.add("popup-card");

    // Add content to the pop-up card (you can customize this part as needed)
    popUpCard.innerHTML = `
        <h2>${name}</h2>
        <p>${location}</p>
        <p>${description}</p>
        <p>Category: ${category}</p>
        <img src="${imgName}" alt="${name}">
    `;

    // Append the pop-up card to the pop-up container
    popUpContainer.appendChild(popUpCard);

    // Add a click event to close the pop-up and show the topbar back
    popUpCard.addEventListener("click", function() {
        popUpContainer.removeChild(popUpCard);

        // Show the topbar again when the pop-up is removed
        topBar.style.display = "block";
    });
}


  // Create a new pop-up card for each click (allowing multiple pop-ups)
  const popUpCard = document.createElement("div");
  popUpCard.classList.add("popup-card");

  // Define image path (assuming images are in "location-imgs" folder)
  const imagePath = `location-imgs/${imgName}`;

  // Pop-up content with image inclusion
  popUpCard.innerHTML = `
      <button class="close-btn">&times;</button>
      <div class="category" style="background: #1a73e8; color: white; padding: 5px 10px; border-radius: 4px; display: inline-block; font-weight: bold; margin-bottom: 10px;">
          ${category}
      </div>
      <div class="scroll-container">
          <div class="scroll-section">
              <h2>${name}</h2>
              <img src="${imagePath}" alt="${name}" style="width: 100%; max-width: 300px; height: auto; border-radius: 10px; margin-top: 10px;">
          </div>
          <div class="scroll-section"><p><strong>Location:</strong> ${location}</p></div>
          <div class="scroll-section"><p><strong>History:</strong> ${description}</p></div>
      </div>
  `;

  // Append pop-up to the container
  popUpContainer.appendChild(popUpCard);

  // Close button functionality
  popUpCard.querySelector(".close-btn").addEventListener("click", function () {
      popUpCard.remove(); // Removes the pop-up from the DOM
  });

  console.log(category, name, location);
}



function changeAvatar(name) {
  document.getElementById("avatar").src = name;
  avatarPNG = "Default.png";
}

function changePath(name) {
  if (name == ""){
      window.color = ["#000000"];
      return;
  }

  document.getElementById("avatarpath").src = name;
  console.log("Color Updated");
  const colorSchemes = {
    default: ["#000000"],
        'paths/Rectangle 1.png': [
        "#FF0000", "#FF1E00", "#FF3D00", "#FF5A00", "#FF7A00", // Red to Orange
        "#FF9600", "#FFB600", "#FFD400", "#FFFF00", "#DAFF00", "#B6FF00", // Orange to Yellow to Green
        "#80FF00", "#4AFF00", "#00FF00", "#00FF3D", "#00FF7A", "#00FFB6", "#00FFFF", // Green to Cyan
        "#00DAFF", "#00B6FF", "#008FFF", "#007AFF", "#0055FF", "#0000FF", "#1E00FF", // Cyan to Blue to Indigo
        "#3D00FF", "#5A00FF", "#7A00FF", "#9600FF", "#B600FF", "#D400FF", "#FF00FF"  // Indigo to Violet
    ],
      'paths/Rectangle 2.png': [
          // Brown to Red
          "#5A2D0C", "#7A1E00", "#9C1500", "#BF0C00", "#E00000", "#FF0000", 

          // Red to Orange
          "#FF1E00", "#FF3D00", "#FF5A00", "#FF7A00", 

          // Orange to Yellow to Green
          "#FF9600", "#FFB600", "#FFD400", "#FFFF00", "#DAFF00", "#B6FF00", 

          // Green to Cyan
          "#80FF00", "#4AFF00", "#00FF00", "#00FF3D", "#00FF7A", "#00FFB6", "#00FFFF", 

          // Cyan to Blue to Indigo
          "#00DAFF", "#00B6FF", "#008FFF", "#007AFF", "#0055FF", "#0000FF", "#1E00FF", 

          // Indigo to Violet
          "#3D00FF", "#5A00FF", "#7A00FF", "#9600FF", "#B600FF", "#D400FF", "#FF00FF", 

          // Violet to Brown
          "#D400FF", "#B000BF", "#8C007F", "#68003F", "#5A2D0C"
      ],
          'paths/Rectangle 3.png': [
        "#D52D00", "#E54A1B", "#F56837", "#FF8550", "#FF9A56", // Deep Red to Orange
        "#F58A78", "#EB7A9A", "#E06ABB", "#D55ADC", "#D162A4", // Orange to Pink/Purple
        "#B94D8C", "#A93678", "#A30262", "#8D0155", "#770048"  // Purple to Deep Magenta
    ],
          'paths/Rectangle 4.png': [
          "#078D70", "#0D9C7F", "#13AA8E", "#1AB89D", "#21C6AB",
          "#26CEAA", "#43D5B0", "#61DCB6", "#7EE2BB", "#9BE8C1",
          "#98E8C1", "#8DD5CA", "#82C3D4", "#77B0DD", "#7BADE2",
          "#6D91DA", "#5F75D3", "#5159CB", "#433DC3", "#5049CC",
          "#473FB4", "#3E359C", "#352B85", "#2C226D", "#3D1A78"
        ],
          'paths/Rectangle 5.png': [
          "#55CDFC", "#6DC7FB", "#85C1FA", "#9DBAF9", "#B5B4F8", "#CDADF7", "#E6A7F6", // Light Blue to Soft Pink
          "#F7A8B8", "#F6AFC0", "#F5B7C8", "#F3BED0", "#F2C6D8", "#F1CDD9", "#F0D5E1", // Soft Pink transition
          "#F0D5FF", // White (center)
          "#F0D5E1", "#F1CDD9", "#F2C6D8", "#F3BED0", "#F5B7C8", "#F6AFC0", "#F7A8B8", // White back to Soft Pink
          "#E6A7F6", "#CDADF7", "#B5B4F8", "#9DBAF9", "#85C1FA", "#6DC7FB", "#55CDFC"  // Soft Pink back to Light Blue
      ]
  };
  window.color = colorSchemes[name] || ["#000000"];
}

