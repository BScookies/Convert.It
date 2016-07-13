class App extends React.Component {

  constructor() {
    super()

    this.state = {
      // state to toggle display:none for the divs
      formatSelectVisibility: '',
      qualitySelectVisiblity: 'hidden',
      dropzoneVisibility: 'hidden',
      // dropzone default params + accepted filetypes
      djsConfig: {
        addRemoveLinks: true,
        acceptedFiles: "audio/mp4,audio/mp3,audio/wav",
        params: {
          format: 'mp3',
          quality: '1'
        }
      },
      // dropzone config for component
      componentConfig: {
        iconFiletypes: ['.mp4', '.mp3', '.wav'],
        showFiletypeIcon: true,
        postUrl: '/uploadHandler'
      },
      // callbacks for dropzone events
      eventHandlers: {
        // All of these receive the event as first parameter:
        drop: null,
        dragstart: null,
        dragend: null,
        dragenter: null,
        dragover: null,
        dragleave: null,
        // All of these receive the file as first parameter:
        addedfile: null,
        removedfile: null,
        thumbnail: null,
        error: null,
        processing: null,
        uploadprogress: null,
        sending: null,
        success: this.showDownload,
        complete: null,
        canceled: null,
        maxfilesreached: null,
        maxfilesexceeded: null,
        // All of these receive a list of files as first parameter
        // and are only called if the uploadMultiple option
        // in djsConfig is true:
        processingmultiple: null,
        sendingmultiple: null,
        successmultiple: null,
        completemultiple: null,
        canceledmultiple: null,
        // Special Events
        totaluploadprogress: null,
        reset: null,
        queuecompleted: null
      }
    }
  }

  // upon successful file processing, display link and "Convert Another" links
  showDownload(file) {
    var url = JSON.parse(file.xhr.response).url
    var content = document.getElementById('content');
    content.innerHTML = '';

    var divNode = document.createElement('div');
    divNode.setAttribute('class', 'buttonContainer');
    content.appendChild(divNode);

    var urlNode = document.createElement('a');
    urlNode.setAttribute('href', url);
    urlNode.setAttribute('download', 'true');
    urlNode.setAttribute('class', 'button');
    urlNode.innerHTML = "Download File";
    divNode.appendChild(urlNode);

    var homeNode = document.createElement('a');
    homeNode.setAttribute('href', '/');
    homeNode.setAttribute('class', 'button');
    homeNode.innerHTML = "Convert Another";
    divNode.appendChild(homeNode);
  }

  // set convert format params from formatSelect onClick events
  selectFormat(format) {
    var djsConfig = this.state.djsConfig;
    djsConfig.params.format = format;

    this.setState({djsConfig: djsConfig});

    // toggle format select visibility once a format has been chosen
    this.setState({formatSelectVisibility: 'hidden'});

    // if format is wav, go straight to uploader, otherwise show quality select
    if (format === 'wav') {
      this.setState({dropzoneVisibility: ''});
    } else {
      this.setState({qualitySelectVisiblity: ''});
    }
  }

  // set convert quality params from qualitySelect onClick events
  selectQuality(quality) {
    var djsConfig = this.state.djsConfig;
    djsConfig.params.quality = quality;

    this.setState({djsConfig: djsConfig});

    // toggle format select visibility once a format has been chosen, then show uploader
    this.setState({qualitySelectVisiblity: 'hidden'});
    this.setState({dropzoneVisibility: ''});
  }

  render() {
    return (
      <div id="app">
        <div id="formatSelect" className={this.state.formatSelectVisibility}>
          <h3>Select destination format:</h3>
          <div className="buttonContainer">
            <a className="button" onClick={function() { this.selectFormat('mp3') }.bind(this)}>MP3</a>
            <a className="button" onClick={function() { this.selectFormat('wav') }.bind(this)}>WAV</a>
            <a className="button" onClick={function() { this.selectFormat('aac') }.bind(this)}>MP4</a>
          </div>
        </div>
        <div id="qualitySelect" className={this.state.qualitySelectVisiblity}>
          <h3>Select desired quality:</h3>
          <div className="buttonContainer">
            <a className="button" onClick={function() { this.selectQuality('0') }.bind(this)}>Meh</a>
            <a className="button" onClick={function() { this.selectQuality('1') }.bind(this)}>Normal</a>
            <a className="button" onClick={function() { this.selectQuality('2') }.bind(this)}>Dayummm</a>
          </div>
        </div>
        <div id="upload" className={this.state.dropzoneVisibility}>
          <DropzoneComponent config={this.state.componentConfig} eventHandlers={this.state.eventHandlers} djsConfig={this.state.djsConfig} />
        </div>
      </div>
    );
  }
};

ReactDOM.render(<App />, document.getElementById('content'));