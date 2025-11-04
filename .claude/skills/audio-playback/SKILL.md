# Audio Playback Skill

## Purpose
YouTube audio player integration for tune playback in the music-app project.

## YouTube Player
```javascript
import YouTube from 'react-youtube';

function TuneAudioPlayer({ videoId }) {
  const [player, setPlayer] = useState(null);

  const opts = {
    height: '0',
    width: '0',
    playerVars: { autoplay: 0 }
  };

  const onReady = (event) => setPlayer(event.target);

  const handlePlay = () => player?.playVideo();
  const handlePause = () => player?.pauseVideo();

  return (
    <>
      <YouTube videoId={videoId} opts={opts} onReady={onReady} />
      <Button onClick={handlePlay}>Play</Button>
      <Button onClick={handlePause}>Pause</Button>
    </>
  );
}
```

## Best Practices
✅ Clean up player on unmount
✅ Handle player errors
✅ Use hidden player (height/width: 0)
❌ Don't forget onReady handler
❌ Don't call methods before ready
