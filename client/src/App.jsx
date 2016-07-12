class App extends React.Component {

  constructor() {
    super()

    this.state = {
      formatSelectVisibility: '',
      qualitySelectVisiblity: 'hidden',
      dropzoneVisibility: 'hidden',
      djsConfig: {
        addRemoveLinks: true,
        acceptedFiles: "audio/mp4,audio/mp3,audio/wav",
        params: {
          format: 'mp3',
          quality: '1'
        }
      },
      componentConfig: {
        iconFiletypes: ['.mp4', '.mp3', '.wav'],
        showFiletypeIcon: true,
        postUrl: '/uploadHandler'
      },
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
        success: this.simpleCallBack,
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

  simpleCallBack(file) {
    var url = JSON.parse(file.xhr.response).url
    document.getElementById('content').innerHTML = '';

    var urlNode = document.createElement('a');
    urlNode.setAttribute('href', url);
    urlNode.setAttribute('download', 'true');
    urlNode.setAttribute('class', 'button');
    urlNode.innerHTML = "Download File";
    document.getElementById('content').appendChild(urlNode);
  }

  selectFormat(format) {
    var djsConfig = this.state.djsConfig;
    djsConfig.params.format = format

    this.setState({djsConfig: djsConfig});
    this.setState({formatSelectVisibility: 'hidden'})
    this.setState({qualitySelectVisiblity: ''});
    console.log(this.state.djsConfig.params.format)
  }

  selectQuality(quality) {
    var djsConfig = this.state.djsConfig;
    djsConfig.params.quality = quality;

    this.setState({djsConfig: djsConfig});
    this.setState({qualitySelectVisiblity: 'hidden'});
    this.setState({dropzoneVisibility: ''});
    console.log(this.state.djsConfig.params.quality)
  }

  render() {
    return (
      <div id="app">
        <div id="formatSelect" className={this.state.formatSelectVisibility}>
          <h3>Select destination format:</h3>
          <a className="button" onClick={function() { this.selectFormat('mp3') }.bind(this)}>MP3</a>
          <a className="button" onClick={function() { this.selectFormat('wav') }.bind(this)}>WAV</a>
          <a className="button" onClick={function() { this.selectFormat('aac') }.bind(this)}>AAC</a>
        </div>
        <div id="qualitySelect" className={this.state.qualitySelectVisiblity}>
          <h3>Select desired quality:</h3>
          <a className="button" onClick={function() { this.selectQuality('0') }.bind(this)}>Meh</a>
          <a className="button" onClick={function() { this.selectQuality('1') }.bind(this)}>Normal</a>
          <a className="button" onClick={function() { this.selectQuality('2') }.bind(this)}>Dayummm</a>
        </div>
        <div id="upload" className={this.state.dropzoneVisibility}>
          <DropzoneComponent config={this.state.componentConfig} eventHandlers={this.state.eventHandlers} djsConfig={this.state.djsConfig} />
        </div>
      </div>
    );
  }
};

//
//
// In the ES6 spec, files are "modules" and do not share a top-level scope
// `var` declarations will only exist globally where explicitly defined
window.App = App;

ReactDOM.render(<App />, document.getElementById('content'));