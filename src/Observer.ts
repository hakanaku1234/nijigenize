import State from './State';

class Observer {
  private controllerTimeout: any;
  
  constructor(private store: {
    setState: <T>(f: (state: State.Mutable, props: { immutable: State.Immutable; mutable: State.Mutable; }) => T) => void;
  }) {
      
  }
    
  onAssetsLoaded(currentAssets: {
    model: any;
    physics: any;
    textures: HTMLImageElement[];
  }): void {
    this.update(() => ({ currentAssets }))
  }
  
  updateParameter(live2DParameter: {[name: string]: number}): void {
    this.update(() => ({ live2DParameter }));
  }
  
  onGetUserMedia(stream: MediaStream): void {
    this.update(() => ({ stream }));
  }
  
  onToggleTracking(): void {
    this.update(mutable => {
      if (mutable.stream) {
        mutable.stream.getTracks()[0].stop();
      }
      return { 
        tracking: !mutable.tracking,
        stream: void 0
      };
    });
  }
  
  onChangeModel(name: string): void {
    this.update((mutable, immutable) => {
      const currentModel = immutable.models[name];
      if (currentModel && !mutable.currentModel) {
        this.controllerTimeout = this.hideContollerTimeout(this.controllerTimeout);
      }
      return { currentModel: currentModel || mutable.currentModel, controllerVisible: true };
    });
  }
  
  onChangeShowVideo(showVideo: boolean): void {
    this.update(() => ({ showVideo }));
  }
  
  onChangeShowTrace(showTrace: boolean): void {
    this.update(() => ({ showTrace }));
  }
  
  onToggleController(): void {
    this.update((mutable) => {
      if (mutable.controllerVisible) {
        return { controllerVisible: false };
      }
      this.controllerTimeout = this.hideContollerTimeout(this.controllerTimeout);
      return { controllerVisible: true };
    });
  }
  
  private hideContollerTimeout(currentTimeout: any): any {
    clearTimeout(currentTimeout);
    return setTimeout(() => this.update(() => ({ controllerVisible: false })), 3000);
  }

  private update(update: (mutable: State.Mutable, immutable: State.Immutable) => any): void {
    this.store.setState((mutable, { immutable }) => update(mutable, immutable));
  }
}

export default Observer;