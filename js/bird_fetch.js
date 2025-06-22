
import { birdSightings } from './birdData.js';

const customRegionMap = {
  "US-UnitedStates": null,
  "NZ-NewZealand": null,
  "Australia": ["Australia"],
  "Singapore": [] // Singapore is handled manually
};



const activeRegions = new Set();

let hoverBox;

function initializeRegionColors(svgDoc) {
  const maxCount = getMaxBirdCount();

  Object.entries(birdSightings).forEach(([regionKey, species]) => {
    const birdCount = Object.keys(species).length;
    const opacity = Math.max(0.2, birdCount / maxCount);
    const green = `rgba(104,166,145,${opacity})`;

    const elements = svgDoc.querySelectorAll(`[data-region="${regionKey}"]`);
    elements.forEach(el => {
      el.style.fill = green;
    });
  });
}



export function loadBirdMap() {
  const objectEl = document.getElementById('bird-map');

  objectEl.addEventListener('load', () => {
    const svgDoc = objectEl.contentDocument;
    if (!svgDoc) {
      console.error("Could not access SVG contentDocument.");
      return;
    }

    hoverBox = document.createElement('div');
    Object.assign(hoverBox.style, {
      position: 'absolute',
      background: '#ffffffcc',
      backdropFilter: 'blur(8px)',
      border: '1px solid #ccc',
      padding: '8px',
      borderRadius: '8px',
      pointerEvents: 'none',
      display: 'none',
      zIndex: 1000
    });
    document.body.appendChild(hoverBox);

    Object.entries(customRegionMap).forEach(([regionKey, classNames]) => {
      if (regionKey === "US-UnitedStates") {
        const usElements = svgDoc.querySelectorAll('.United.States');
        usElements.forEach(el => {
          el.dataset.region = regionKey;
          addRegionListeners(el, regionKey);
        });
      } else if (regionKey === "NZ-NewZealand") {
        const nzElements = svgDoc.querySelectorAll('.New.Zealand');
        nzElements.forEach(el => {
          el.dataset.region = regionKey;
          addRegionListeners(el, regionKey);
        });
      } else if (classNames && classNames.length > 0) {
        classNames.forEach(cls => {
          const elements = svgDoc.querySelectorAll(`.${cls}`);
          elements.forEach(el => {
            el.dataset.region = regionKey;
            addRegionListeners(el, regionKey);


        initializeRegionColors(svgDoc);

          });
        });
      }
    });
  }); 
} 



const maxCount = getMaxBirdCount();

function getMaxBirdCount() {
  return Math.max(...Object.values(birdSightings).map(region => Object.keys(region).length));

}

function removeBirdCards(regionKey) {
  const panel = document.getElementById('info-panel');
  const cards = panel.querySelectorAll(`.info-card[data-region="${regionKey}"]`);

  cards.forEach(card => {
    card.style.transition = 'opacity 0.3s ease';
    card.style.opacity = '0';
    setTimeout(() => card.remove(), 300); // Wait for fade-out
  });
}


loadBirdMap();

async function fetchBirdInfo(speciesName) {
  const response = await fetch(`https://nuthatch.lastelm.software/v2/birds?name=${encodeURIComponent(speciesName)}`, {
    headers: {
      'api-key': 'aff0120e-5b06-446a-8fc8-728ef60f4642'
    }
  });

  if (!response.ok) throw new Error(`Failed to fetch info for ${speciesName}`);
  const data = await response.json();
  return data.entities || [];
}


async function showBirdInfoCards(regionKey) {

  const svgDoc = document.getElementById('bird-map')?.contentDocument;
  if (!svgDoc) {
    console.warn('SVG document not found.');
    return;
  }

  const elements = svgDoc.querySelectorAll(`[data-region="${regionKey}"]`);
  const birdCount = Object.keys(birdSightings[regionKey]).length;
  const maxCount = getMaxBirdCount();
  const opacity = Math.max(0.2, birdCount / maxCount);
const burgundy = `rgba(128, 0, 32, ${opacity})`;

elements.forEach(el => {
  el.style.fill = burgundy;
});
  console.log(regionKey, 'Birds:', birdCount, 'Max:', maxCount, 'Opacity:', opacity);



  const container = document.getElementById('info-panel');
  if (!container) return;
    removeBirdCards(regionKey);

  const speciesList = Object.keys(birdSightings[regionKey]);
  const renderedSpecies = new Set();

  for (const speciesName of speciesList) {
    if (renderedSpecies.has(speciesName)) continue;
    renderedSpecies.add(speciesName);

    const localPhotos = birdSightings[regionKey][speciesName];
    if (!localPhotos || localPhotos.length === 0) continue;

    // 🧠 Attempt exact match from Nuthatch
    let sciName = null;
    let status = null;
    try {
      const birds = await fetchBirdInfo(speciesName);
      const match = birds.find(b => b.name.toLowerCase() === speciesName.toLowerCase());
      if (match) {
        sciName = match.sciName;
        status = match.status || 'Unknown';
      } else {
        console.warn(`🔍 No exact API match for "${speciesName}"`);
      }
    } catch (err) {
      console.warn(`❌ Failed API call for "${speciesName}"`, err);
    }

    const previewImg = localPhotos[0];

    const card = document.createElement('div');
    card.className = 'info-card';
    card.dataset.species = speciesName;
    card.dataset.region = regionKey;

    const commonName = document.createElement('h3');
commonName.textContent = speciesName;
card.appendChild(commonName);


    const img = document.createElement('img');
    img.src = previewImg;
    img.alt = speciesName;
    img.style.width = '100%';
    img.style.borderRadius = '6px';

    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.style.display = 'none';

    if (sciName || status) {
      overlay.innerHTML = `
        ${sciName ? `<p><em>${sciName}</em></p>` : ''}
        ${status ? `<p>Status: ${status}</p>` : ''}
      `;
    }

    const gallery = document.createElement('div');
    gallery.className = 'gallery';
    gallery.style.display = 'none';

    // Only add images that are NOT the preview
    localPhotos.slice(1).forEach(photo => {
      const thumb = document.createElement('img');
      thumb.src = photo;
      thumb.alt = speciesName;
      thumb.style.width = '100%';
      thumb.style.marginTop = '6px';
      gallery.appendChild(thumb);
    });

    let current = 0;
    let cycle;

    card.addEventListener('mouseenter', () => {
      overlay.style.display = 'block';
      if (localPhotos.length > 1) {
        cycle = setInterval(() => {
          current = (current + 1) % localPhotos.length;
          img.src = localPhotos[current];
        }, 1000);
      }
    });

    card.addEventListener('mouseleave', () => {
      overlay.style.display = 'none';
      clearInterval(cycle);
      img.src = previewImg;
      current = 0;
    });

    let expanded = false;
    card.addEventListener('click', () => {
      expanded = !expanded;
      gallery.style.display = expanded ? 'block' : 'none';
    });

    card.appendChild(img);
    if (sciName || status) card.appendChild(overlay);
    if (gallery.childElementCount > 0) card.appendChild(gallery);

    container.appendChild(card);
  }
}


function addRegionListeners(el, regionKey) {
  el.addEventListener('click', async () => {
    const svgDoc = document.getElementById('bird-map')?.contentDocument;
    if (!svgDoc) return;

    const elements = svgDoc.querySelectorAll(`[data-region="${regionKey}"]`);

    if (activeRegions.has(regionKey)) {
      // 🔄 Deselect: remove cards, revert to green
      activeRegions.delete(regionKey);
      removeBirdCards(regionKey);

      const birdCount = Object.keys(birdSightings[regionKey]).length;
      const maxCount = getMaxBirdCount();
      const green = `rgba(104,166,145,${Math.max(0.2, birdCount / maxCount)})`;

      elements.forEach(el => {
        el.style.fill = green;
      });
    } else {
      // ✅ Select: show cards, change to burgundy
      activeRegions.add(regionKey);
      showBirdInfoCards(regionKey); // this colors it burgundy and creates cards
    }
  });
}


const singaporeEl = document.getElementById('sg-pin');
singaporeEl.dataset.region = 'Singapore';
addRegionListeners(singaporeEl, 'Singapore');
