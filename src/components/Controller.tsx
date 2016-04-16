import * as React from 'react';
import State from '../State';

class Controller extends React.Component<Controller.Props, void> {
  render(): JSX.Element {
    const style = { display: this.props.mutable.currentModel ? 'block' : 'none', marginTop: '8px' };
    return <div>
      <select defaultValue='0' onChange={event => this.props.observer.onChangeModel(event.currentTarget['value'])} >
        <option value='0' disabled='disabled'>Select model</option>
        {Object.keys(this.props.immutable.models).map((name, index) => <option key={index} value={name}>{name}</option>)}
      </select>
      <button onClick={() => this.props.observer.onToggleTracking()} style={style}>{this.props.mutable.tracking ? 'Stop' : 'Start'} tracking</button>
      <label style={style}><input type='checkbox'
        checked={this.props.mutable.showVideo}
        onChange={event => this.props.observer.onChangeShowVideo((event.currentTarget as HTMLInputElement).checked)}
      />Show tracking video</label>
      <label style={style}><input type='checkbox'
        checked={this.props.mutable.showTrace}
        onChange={event => this.props.observer.onChangeShowTrace((event.currentTarget as HTMLInputElement).checked)}
      />Show tracking trace</label>
    </div>;
  }
}

namespace Controller {
  export interface Props {
    mutable: {
      tracking: boolean;
      showVideo: boolean;
      showTrace: boolean;
      currentModel?: State.Model;
  };
    immutable: {
      models: {[name: string]: State.Model};
    };
    observer: {
      onChangeModel(name: string): void;
      onToggleTracking(): void;
      onChangeShowVideo(showVideo: boolean): void;
      onChangeShowTrace(showTrace: boolean): void;
    }
  }
}

export default Controller;