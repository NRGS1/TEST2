import '@ar-js-org/ar.js';
import 'aframe-look-at-component';
import 'aframe-osm-3d';


AFRAME.registerComponent('poifinder', {

    init: function() {


        this.camera = document.querySelector('a-camera');

        // Handle a GPS update ...
        window.addEventListener('gps-camera-update-position', e => {
            console.log(`pos ${e.detail.position.latitude} ${e.detail.position.longitude}`);
            
            //Set the latitude and logitude and download the DEM data
            console.log('Calling terrarium dem..');
            this.el.setAttribute('terrarium-dem', {
                lat: e.detail.position.latitude,
                lon: e.detail.position.longitude 
            })
        });

        // the OSM-DATA-LOADED event will fire when the OSM data has been downloaded.
        this.el.addEventListener('osm-data-loaded', e => {


            //the e.detail.pois have Geojson stored and it will 
            //be use to filter the results to project the features specified
            e.detail.pois
            //the filter function will search all the POIS that contains the cafe property
                .filter ( poi => poi.properties.amenity == 'cafe')
                .forEach ( cafe => {

                    //creates an entity for the text and gltf model and a compound entity which it will contain
                    //the text and gltf model
                    const textEntity = document.createElement('a-text');
                    const coffeentity = document.createElement('a-entity');
                    const backtext = document.createElement('a-plane');
                    const compoundEntity = document.createElement('a-entity');

                    //Import the model and will specify the size and the position
                    coffeentity.setAttribute('gltf-model', '#coffee');

                    coffeentity.setAttribute('position', {
                        x: -30,
                        y: 0,
                        z: 0
                    });

                    coffeentity.setAttribute('scale',  {
                        x: 10,
                        y: 10,
                        z: 10
                    });

                    //set the compound entity on the lat log of the poi
                    compoundEntity.setAttribute('position', {    
                        x: 0,
                        y: cafe.geometry.coordinates[2],
                        z: 0
                    });

                    // set the lat and lon of the compound entity by setting
                    // its gps-projected-entity place component
                    compoundEntity.setAttribute('gps-projected-entity-place', {
                        latitude: cafe.geometry.coordinates[1],
                        longitude: cafe.geometry.coordinates[0]
                    });

                    // Set the text scale
                    textEntity.setAttribute('color','#000')
                    textEntity.setAttribute('scale',  {
                        x: 20,
                        y: 20,
                        z: 20
                    });
                    
                    backtext.setAttribute('height', 20);
                    backtext.setAttribute('width', 30);
                    backtext.setAttribute('color', {
                        color: 'white'
                    });



                    // Make the model and text to look-at the camera
                    coffeentity.setAttribute('look-at', '[gps-projected-camera]');
                    backtext.setAttribute('look-at', '[gps-projected-camera]');
                    textEntity.setAttribute('look-at', '[gps-projected-camera]');

    
                    
                    // text is placed at the parent entity's world position
                    // if the poi do not have a name it will display 'No name'
                    textEntity.setAttribute('align', 'center');
                    textEntity.setAttribute('value', cafe.properties.name || 'No name');

                    // The values that be parsed after the user clicks on the POI
                    coffeentity.setAttribute("clicker", {
                        name: cafe.properties.name,
                        website: cafe.properties.website
                    });
                    backtext.appendChild(textEntity);


                    //add the text and model elements inside the compound entity
                    compoundEntity.appendChild(backtext);
                    compoundEntity.appendChild(coffeentity);
                    
                    // Add the compound entity to the scene
                    this.el.sceneEl.appendChild(compoundEntity);
            });

            //the e.detail.pois have Geojson stored and it will 
            //be use to filter the results to project the features specified
            e.detail.pois
            //the filter function will search all the POIS that contains the restaurant property
            .filter ( poi => poi.properties.amenity == 'restaurant')
            .forEach ( restaurant => {

                //creates an entity for the text and gltf model and a compound entity which it will contain
                //the text and gltf model
                const textEntity = document.createElement('a-text');
                const foodentity = document.createElement('a-entity');
                const backtext = document.createElement('a-plane');
                const compoundEntity = document.createElement('a-entity');
                    
                //Import the model and will specify the size and the position
                foodentity.setAttribute('gltf-model', '#food');

                foodentity.setAttribute('position', {
                    x: 0,
                    y: 10,
                    z: 0
                });

                foodentity.setAttribute('scale',  {
                    x: 30,
                    y: 30,
                    z: 30
                });

                //set the compound entity on the lat log of the poi
                compoundEntity.setAttribute('position', {    
                    x: 0,
                    y: restaurant.geometry.coordinates[2],
                    z: 0
                });

                // set the lat and lon of the compound entity by setting
                // its gps-projected-entity place component
                compoundEntity.setAttribute('gps-projected-entity-place', {
                    latitude: restaurant.geometry.coordinates[1],
                    longitude: restaurant.geometry.coordinates[0]
                });

                    // Set the text scale
                    textEntity.setAttribute('color','#000')
                    textEntity.setAttribute('scale',  {
                        x: 20,
                        y: 20,
                        z: 20
                    });
                    
                    backtext.setAttribute('height', 20);
                    backtext.setAttribute('width', 30);
                    backtext.setAttribute('color', {
                        color: 'white'
                    });

                // Make the model and text to look-at the camera
                foodentity.setAttribute('look-at', '[gps-projected-camera]')
                backtext.setAttribute('look-at', '[gps-projected-camera]');
                textEntity.setAttribute('look-at', '[gps-projected-camera]');


                 // text is placed at the parent entity's world position
                 // if the poi do not have a name it will display 'No name'
                textEntity.setAttribute('align', 'center');
                textEntity.setAttribute('value', restaurant.properties.name || 'No name');

                // The values that be parsed after the user clicks on the POI
                foodentity.setAttribute("clicker", {
                    name: restaurant.properties.name,
                    website: restaurant.properties.website
                });
                backtext.appendChild(textEntity);

                //add the text and model elements inside the compound entity
                compoundEntity.appendChild(backtext);
                compoundEntity.appendChild(foodentity);
                
                // Add the compound entity to the scene
                this.el.sceneEl.appendChild(compoundEntity);
        });
        });
    }
});


AFRAME.registerComponent('clicker', {
    // Schema - allowing name and website to be passed in 
    schema: {
        name: {
            type: 'string',
            default: '',
        },
        website: {
            type: 'string',
            default: '',
        }
    },
    init: function() {
        this.el.addEventListener('click', e=> {

            //check if the Poi have a website
            if(`${this.data.website}` == ''){
                alert(`${this.data.name}`+' do not have a website incorpored. Cancel will load this website ');
            }else{
            if (window.confirm('If you click "ok" you would be redirected to '+`${this.data.name}`+' website. If you click Cancel you will continue on this page')) {
                window.location.href = `${this.data.website}`;
             };

            }
        });
    }
    
});