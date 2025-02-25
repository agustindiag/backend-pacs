const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;
const axios = require("axios");

// Habilitar CORS para todos los orígenes
app.use(cors());


app.get('/dcm4chee-arc/aets/DCM4CHEE/rs/studies', (req, res) => {

    if (req.query.PatientName) {
        fetch(`http://192.168.1.118:8080/dcm4chee-arc/aets/DCM4CHEE/rs/studies?includefield=all&limit=21&orderby=-StudyDate,-StudyTime&returnempty=false&PatientName=${req.query.PatientName}`, {
            method: 'GET', // o 'POST' según lo que necesites
            headers: {
                'Content-Type': 'application/json',
                // Aquí puedes agregar otros encabezados si es necesario
            },
        })
            .then(response => response.json())  // Si la respuesta es en JSON
            .then(data => {
                res.json(data);
            })
            .catch(error => {
                console.error('Error:', error);
                res.json([]);
            });
    } else if (req.query.PatientID) {
        fetch(`http://192.168.1.118:8080/dcm4chee-arc/aets/DCM4CHEE/rs/studies?includefield=all&limit=21&orderby=-StudyDate,-StudyTime&returnempty=false&PatientID=${req.query.PatientID}`, {
            method: 'GET', // o 'POST' según lo que necesites
            headers: {
                'Content-Type': 'application/json',
                // Aquí puedes agregar otros encabezados si es necesario
            },
        })
            .then(response => response.json())  // Si la respuesta es en JSON
            .then(data => {
                res.json(data);
            })
            .catch(error => {
                console.error('Error:', error);
                res.json([]);
            });
    } else {
        fetch(`http://192.168.1.118:8080/dcm4chee-arc/aets/DCM4CHEE/rs/studies?includefield=all&limit=21&orderby=-StudyDate,-StudyTime&returnempty=false`, {
            method: 'GET', // o 'POST' según lo que necesites
            headers: {
                'Content-Type': 'application/json',
                // Aquí puedes agregar otros encabezados si es necesario
            },
        })
            .then(response => response.json())  // Si la respuesta es en JSON
            .then(data => {
                res.json(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    /* fetch(`http://192.168.1.118:8080/dcm4chee-arc/aets/DCM4CHEE/rs/studies?limit=${req.query.limit}&offset=${parseInt(req.query.offset)}&fuzzymatching=${req.query.fuzzymatching}&includefield=${req.query.includefield}&StudyDate=${req.query.StudyDate}`, {
        method: 'GET', // o 'POST' según lo que necesites
        headers: {
            'Content-Type': 'application/json',
            // Aquí puedes agregar otros encabezados si es necesario
        },
    })
        .then(response => response.json())  // Si la respuesta es en JSON
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error:', error);
        }); */
});

app.get('/dcm4chee-arc/aets/DCM4CHEE/rs/studies/:study/series', (req, res) => {

    console.log("Llego a serie")

    fetch(`http://192.168.1.118:8080/dcm4chee-arc/aets/DCM4CHEE/rs/studies/${req.params.study}/series`, {
        method: 'GET', // o 'POST' según lo que necesites
        headers: {
            'Content-Type': 'application/json',
            // Aquí puedes agregar otros encabezados si es necesario
        },
    })
        .then(response => response.json())  // Si la respuesta es en JSON
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

app.get('/dcm4chee-arc/aets/DCM4CHEE/rs/studies/:study/series/:serie/metadata', (req, res) => {

    console.log("Llego a metadata")

    fetch(`http://192.168.1.118:8080/dcm4chee-arc/aets/DCM4CHEE/rs/studies/${req.params.study}/series/${req.params.serie}/metadata`, {
        method: 'GET', // o 'POST' según lo que necesites
        headers: {
            'Content-Type': 'application/json',
            // Aquí puedes agregar otros encabezados si es necesario
        },
    })
        .then(response => response.json())  // Si la respuesta es en JSON
        .then(data => {
            res.json(JSON.parse(JSON.stringify(data).split("http://192.168.1.118:8080").join("http://192.168.1.118:3001")));
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

app.get('/dcm4chee-arc/aets/DCM4CHEE/rs/studies/:study/series/:serie/instances/:instance/frames/:frame', async (req, res) => {

    console.log("Llego a llego a frame")

    const response = await axios.get(`http://192.168.1.118:8080/dcm4chee-arc/aets/DCM4CHEE/rs/studies/${req.params.study}/series/${req.params.serie}/instances/${req.params.instance}/frames/${req.params.frame}`, {
        responseType: 'arraybuffer', // Importante para imágenes DICOM
        headers: {
            Accept: 'multipart/related; type="application/octet-stream"',
        }
    });

    // Configurar headers de respuesta
    res.set({
        'Content-Type': response.headers['content-type'],
        'Content-Length': response.headers['content-length']
    });

    // Enviar la respuesta de dcm4chee a OHIF
    res.send(response.data);
});

app.get('/dcm4chee-arc/aets/DCM4CHEE/rs/studies/:study/series/:serie/instances/:instance/bulkdata/:bulkdata', async (req, res) => {

    console.log("Llego a bulkdata")
    
    try {
        const response = await axios.get(`http://192.168.1.118:8080/dcm4chee-arc/aets/DCM4CHEE/rs/studies/${req.params.study}/series/${req.params.serie}/instances/${req.params.instance}/bulkdata/${req.params.bulkdata}`, {
            responseType: 'arraybuffer', // Importante para imágenes DICOM
            headers: {
                Accept: 'multipart/related; type="application/octet-stream"',
            }
        });

        // Configurar headers de respuesta
        res.set({
            'Content-Type': response.headers['content-type'],
            'Content-Length': response.headers['content-length']
        });

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        // Enviar la respuesta de dcm4chee a OHIF
        res.send(response.data);
    } catch (error) {
        console.log(error)
    }
});

app.get('/dcm4chee-arc/aets/DCM4CHEE/wado', async (req, res) => {

    const response = await axios.get(`http://192.168.1.118:8080/dcm4chee-arc/aets/DCM4CHEE/wado?requestType=WADO&studyUID=1.2.826.0.1.3680043.8.498.12943395540074787262641921769148467229&seriesUID=1.2.826.0.1.3680043.8.498.45710769804797615640428624157275261860&objectUID=1.2.826.0.1.3680043.8.498.10237564599285669938162481784404921684`, {
        responseType: 'arraybuffer', // Importante para imágenes DICOM
        headers: {
            Accept: 'multipart/related; type="application/octet-stream"',
        }
    });

    // Configurar headers de respuesta
    res.set({
        'Content-Type': response.headers['content-type'],
        'Content-Length': response.headers['content-length']
    });

    // Enviar la respuesta de dcm4chee a OHIF
    res.send(response.data);
});



// Conexion con HOROS








app.get('/dcm4chee-arc/aets/DCM4CHEE/dimse/HOROS/studies', (req, res) => {

    console.log("Llego a HOROS")

    fetch(`http://192.168.1.118:8080/dcm4chee-arc/aets/DCM4CHEE/dimse/HOROS/studies?includefield=all&returnempty=false`, {
        method: 'GET', // o 'POST' según lo que necesites
        headers: {
            'Content-Type': 'application/json',
            // Aquí puedes agregar otros encabezados si es necesario
        },
    })
        .then(response => response.json())  // Si la respuesta es en JSON
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

app.get('/dcm4chee-arc/aets/DCM4CHEE/dimse/HOROS/studies/:study/series', (req, res) => {

    console.log("Llego a serie")

    fetch(`http://192.168.1.118:8080/dcm4chee-arc/aets/DCM4CHEE/dimse/HOROS/studies/${req.params.study}/series`, {
        method: 'GET', // o 'POST' según lo que necesites
        headers: {
            'Content-Type': 'application/json',
            // Aquí puedes agregar otros encabezados si es necesario
        },
    })
        .then(response => response.json())  // Si la respuesta es en JSON
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

app.get('/dcm4chee-arc/aets/DCM4CHEE/dimse/HOROS/studies/:study/series/:serie/metadata', (req, res) => {

    console.log("Llego a metadata")

    fetch(`http://192.168.1.118:8080/dcm4chee-arc/aets/DCM4CHEE/dimse/HOROS/studies/${req.params.study}/series/${req.params.serie}/metadata`, {
        method: 'GET', // o 'POST' según lo que necesites
        headers: {
            'Content-Type': 'application/json',
            // Aquí puedes agregar otros encabezados si es necesario
        },
    })
        .then(response => response.json())  // Si la respuesta es en JSON
        .then(data => {
            res.json(data);
            //res.json(JSON.parse(JSON.stringify(data).split("http://192.168.1.118:8080").join("http://192.168.1.118:3001")));
        })
        .catch(error => {
            console.error('Error:', error);
        });
});


// /dcm4chee-arc/aets/DCM4CHEE/dimse/HOROS/studies?includefield=all&limit=21&returnempty=false

app.post("/upload", (req,res) => {
    console.log(req)
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});