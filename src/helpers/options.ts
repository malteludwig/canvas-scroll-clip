/**
 * Boomerang.js options interface.
 *
 * @export
 * @interface IOptions
 */
export interface IOptions {
  framePath: string,
  frameCount: number;
}

/**
 * Frame Sequence interface.
 *
 * @export
 * @interface IFrame
 */
export interface IFrameSequence {
  start: string,
  sequence: number,
  padStart: number,
  ending: string,
  extension: string,
}

/**
 * Frame interface.
 *
 * @export
 * @interface IFrame
 */
export interface IFrame {
  path: string,
  count: number,
  image: IFrameSequence
}

/**
 * Boomerang options.
 *
 * @export
 * @class Options
 * @implements {IOptions}
 */
export class Options implements IOptions {

  public frame: IFrame
  public framePath = '';
  public frameCount = 1;

  /**
   * Creates an instance of Options.
   * @param {IOptions} [options] Options to copy properties.
   * @memberof Options
   */
  constructor(options: IOptions) {

    if (!options.framePath) {
      throw new Error('Frame path is not defined.');
    }

    if (!options.frameCount) {
      throw new Error('Frame count is not defined.')
    }

    // TODO: should I refactor this due to frame property?
    Object.assign(this, options);

    // Frame sequence options
    this.frame = {
      path: this.getImageBasePath(this.framePath),
      image: this.getImageStructure(this.framePath, this.frameCount),
      count: this.frameCount
    } as IFrame;
  }

  /**
   * Get image base path
   * 
   * @param firstFramePath 
   * @returns 
   */
  private getImageBasePath(firstFramePath: string): string {
    const path = firstFramePath.split('/');

    path.pop();

    return `${path.join('/')}/`;
  }

  /**
   * Get frame image structure
   * 
   * @param {string} firstFramePath 
   * @param {number} frameCount 
   * @returns 
   */
  private getImageStructure(firstFramePath: string, frameCount: number): IFrameSequence {
    const img = this.getPathEnding(firstFramePath);
    const ext = this.getImageExtension(img);
    const seq = this.getImageSequence(img);

    if (frameCount.toString().length > seq.length) {
      throw new Error(`Leading zeros in first frame path has to be more than the frame count and sequence at the end.`);
    }

    return {
      start: img.slice(0, img.indexOf(seq)),
      sequence: parseInt(seq),
      padStart: seq.length,
      ending: img.slice(img.indexOf(seq) + seq.length),
      extension: ext,
    };
  }

  /**
   * Get image sequence with leading zeros
   * 
   * @param {string} imageName 
   * @returns {string}
   * @throws {Error} image sequence format not supported
   */
  private getImageSequence(imageName: string): string {
    const sequence = new RegExp(/\d+(?!.*\d+)/).exec(imageName);

    if (sequence === null || sequence[0].length < 2) {
      throw new Error('Bad image sequence format. Should start with 0 and be longer than 2 numbers, f.e. "frame_01.jpg"')
    }

    return sequence[0];
  }

  /**
   * Get image extension
   * 
   * @param imageName 
   * @returns {string}
   * @throws {Error} Unsupported image
   */
  private getImageExtension(imageName: string): string {
    const ext = imageName.split('.').pop() || ' ';

    if (!['jpg', 'jpeg', 'png'].includes(ext)) {
      throw new Error(`Image with extension ['${ext}'] is not supported.`);
    }

    return `.${ext}`;
  }

  /**
   * Get ending of a url
   * 
   * @param path 
   * @returns 
   */
  private getPathEnding(path: string): string {
    const splitted = path.split('/');

    return splitted.pop() || '';
  }
}

/**
 * @export
 */
export default Options;