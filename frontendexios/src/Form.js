import React, { Component } from 'react';
import axios from 'axios';
import './Form.css';
class Form extends Component {
    constructor(props) {
        super(props);
        this.state = { eligible: false, uploadedStatus: 0, file: null, size: 0, uploadedSize: 0, fileName: '', showAlert: false };
        this.fileUpload = this.fileUpload.bind(this);
    }

    handleChange(e) {
        if (e.target.files[0].size <= 52428800000000000) {
            this.setState({ file: e.target.files[0], size: Math.ceil((e.target.files[0].size / 1024) / 1024), uploadedStatus: 0, uploadedSize: 0, eligible: true, fileName: e.target.files[0].name });
        } else {
            alert("File is too large")
        }
    }
    fileuploadProgress = (progressEvent) => {
        var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        var uploadingSize = Number((progressEvent.loaded / 1024) / 1024).toFixed(2);
        this.setState({ uploadedStatus: percentCompleted, uploadedSize: uploadingSize });
    }

    async fileUpload(e) {
        e.preventDefault();
        if (!this.state.eligible) {
            alert("Choose some other file");
            return
        }
        if (this.state.file) {
            const data = new FormData();
            var filename;
            if (this.fileName.value !== '') {
                filename = this.fileName.value;
            } else {
                filename = this.state.file.name.split('.')[0];
            }
            data.append('file', this.state.file);
            data.append('filename', filename);
            data.append('format', this.state.file.name.split('.').pop());
            var resp = await axios.post('http://localhost:8000/upload', data, {onUploadProgress: this.fileuploadProgress});
            if (resp.data) {
                this.setState({ fileName: '', file: null, eligible: false, showAlert: true });
                setTimeout(function () {
                    this.setState({ showAlert: false });
                }.bind(this), 4000);
            }
        }
        else {
            alert("No files choosen");
        }
    }
    removeFile() {
        if (this.state.file === null) {
            alert("No file is choosen");
        } else {
            this.setState({ file: null, fileName: '' });
        }
    }
    render() {
        var bgColor;
        if (this.state.uploadedStatus <= 30) {
            bgColor = 'red';
        } else if (this.state.uploadedStatus < 100) {
            bgColor = 'blue';
        } else {
            bgColor = 'green';
        }
        const barLevel = {
            width: this.state.uploadedStatus + '%',
            background: bgColor
        }
        return (
            <div className="container box">
                <form onSubmit={this.fileUpload}>
                    <div className="form-group ">
                        <input className="file-input" onChange={this.handleChange.bind(this)} type="file" />
                    </div>
                    <div className="form-group">
                        <input className="form-control" ref={(ref) => { this.fileName = ref; }} type="text" placeholder="Optional name for the file" />
                    </div>
                    <button className="btn btn-success" type="submit">Upload</button>
                </form>
                <div >
                    <div className="name-part">
                        <h2>Selected File:</h2>
                        <h2>{this.state.fileName}</h2>
                    </div>
                    <button className="btn btn-danger" onClick={this.removeFile.bind(this)}>Remove</button>
                </div>
                <div className="container">
                    <h2>Progress Bar</h2>
                    <div className="progress">
                        <div className="progress-bar" style={barLevel}>{this.state.uploadedStatus}%</div>
                    </div>
                </div>

                <h3>{this.state.uploadedSize}MB</h3>
                {
                    this.state.showAlert ? <div className="alert alert-success" data-auto-dismiss role="alert">
                        <strong>Success!</strong> File has been uploaded Successfully!!!
                </div> : ''
                }
            </div>
        );
    };
};
export default Form;
