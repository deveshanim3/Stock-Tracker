export const playAlertSound = () => {
  const audio = new Audio("/alert.mp3")
  audio.volume = 0.7;  
  audio.play().catch(() => {})
};

export const playSuccessSound=()=>{
    const audio=new Audio("/success.mp3")
    audio.volume=0.7
    audio.play().catch(()=>{})
}
