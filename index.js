const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;
const axios = require("axios");

// Habilitar CORS para todos los orígenes
app.use(cors());


app.get('/dcm4chee-arc/aets/DCM4CHEE/rs/studies', (req, res) => {

    if (req.query.PatientName) {
        fetch(`http://192.168.1.115:8080/dcm4chee-arc/aets/DCM4CHEE/rs/studies?includefield=all&limit=21&orderby=-StudyDate,-StudyTime&returnempty=false&PatientName=${req.query.PatientName}`, {
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
        fetch(`http://192.168.1.115:8080/dcm4chee-arc/aets/DCM4CHEE/rs/studies?includefield=all&limit=21&orderby=-StudyDate,-StudyTime&returnempty=false&PatientID=${req.query.PatientID}`, {
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
        fetch(`http://192.168.1.115:8080/dcm4chee-arc/aets/DCM4CHEE/rs/studies?includefield=all&limit=21&orderby=-StudyDate,-StudyTime&returnempty=false`, {
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

    /* fetch(`http://192.168.1.115:8080/dcm4chee-arc/aets/DCM4CHEE/rs/studies?limit=${req.query.limit}&offset=${parseInt(req.query.offset)}&fuzzymatching=${req.query.fuzzymatching}&includefield=${req.query.includefield}&StudyDate=${req.query.StudyDate}`, {
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

    fetch(`http://192.168.1.115:8080/dcm4chee-arc/aets/DCM4CHEE/rs/studies/${req.params.study}/series`, {
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


    fetch(`http://192.168.1.115:8080/dcm4chee-arc/aets/DCM4CHEE/rs/studies/${req.params.study}/series/${req.params.serie}/metadata`, {
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

app.get('/dcm4chee-arc/aets/DCM4CHEE/rs/studies/:study/series/:serie/instances/:instance/frames/:frame', async (req, res) => {

    const response = await axios.get(`http://192.168.1.115:8080/dcm4chee-arc/aets/DCM4CHEE/rs/studies/${req.params.study}/series/${req.params.serie}/instances/${req.params.instance}/frames/${req.params.frame}`, {
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

app.get('/dcm4chee-arc/aets/DCM4CHEE/wado', async (req, res) => {

    const response = await axios.get(`http://192.168.1.115:8080/dcm4chee-arc/aets/DCM4CHEE/wado?requestType=WADO&studyUID=1.2.826.0.1.3680043.8.498.12943395540074787262641921769148467229&seriesUID=1.2.826.0.1.3680043.8.498.45710769804797615640428624157275261860&objectUID=1.2.826.0.1.3680043.8.498.10237564599285669938162481784404921684`, {
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

/* http://192.168.1.115:8080/dcm4chee-arc/aets/DCM4CHEE/wado?requestType=WADO&studyUID=1.2.826.0.1.3680043.8.498.12943395540074787262641921769148467229&seriesUID=1.2.826.0.1.3680043.8.498.45710769804797615640428624157275261860&objectUID=1.2.826.0.1.3680043.8.498.10237564599285669938162481784404921684&frameNumber=1 */

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});