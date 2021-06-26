import React, { useEffect, useState } from 'react';
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import { useSelector } from "react-redux";

const { TextArea } = Input;
const { Title } = Typography;

const PrivateOptions = [
    { value: 0, label: "Private" },
    { value: 1, label: "Public" }
]


function VideoUploadPage() {
    const user = useSelector(state => state.user);
    const [VideoTitle, setVideoTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [FP,setFP] = useState("")
    const [FilePath, setFilePath] = useState("")
    const [Private, setPrivate] = useState(0)
    

    const onTitleChange = (e) => {
        setVideoTitle(e.currentTarget.value)
    }

    const onDescriptionChange = (e) => {
        setDescription(e.currentTarget.value)
    }

    const onPrivateChange = (e) => {
        setPrivate(e.currentTarget.value)
        
    }

    const onDrop = (files) => {
        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        formData.append("file", files[0])
        Axios.post('/api/video/uploadfiles', formData, config)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.filePath)
                    setFP(response.data.filePath)
                } else {
                    alert('failed to save the video in server')
                }
                
            })


    }
    const onSubmit = (event) => {
        event.preventDefault();
        if (user.userData && !user.userData.isAuth) {
            return alert('Please Log in First')
        }


        if (VideoTitle === "" || Description === "" ||
            FP === "") {
            return alert('Successful')
        }

        const variables = {
            writer: user.userData._id,
            title: VideoTitle,
            description: Description,
            privacy: Private,
            filePath: FP
        }

        Axios.post('/api/video/uploadVideo', variables)
            .then(response => {
                if (response.data.success) {
                    alert('video Uploaded Successfully')
                    //props.history.push('/')
                } else {
                    alert('Failed to upload video')
                }
            })

    }

    const onClick = (e) =>{
        Axios.get('/api/video/getMusic').then(response=>
    {
        var musics = response.data.music;
        for (let step = 0; step < musics.length;step++){
            console.log(response.data.music[step]);
        }
        
    })
    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }} >
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>

            </div>

            <Form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Dropzone
                        onDrop={onDrop}
                        multiple={false}
                        maxSize={800000000}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <div style={{
                                width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex',
                                alignItems: 'center', justifyContent: 'center'
                            }} {...getRootProps()}>
                                <input {...getInputProps()} />
                                <Icon type="plus" style={{ fontSize: '3rem' }} />
                            </div>


                        )}

                    </Dropzone>
                </div>
                <br />
                <br />
                <label>Title</label>
                <Input
                    onChange={onTitleChange}
                    value={VideoTitle}
                />
                <br />
                <br />
                <label>Description</label>
                <TextArea
                    onChange={onDescriptionChange}
                    value={Description}
                />
                <br />
                <br />

                <select onChange={onPrivateChange}>

                    {PrivateOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}

                </select>

                <br />
                <br />
                <Button type="primary" size="large" onClick ={onSubmit}>
                    Submit
                </Button>

            </Form>


        </div >
    )
}

export default VideoUploadPage