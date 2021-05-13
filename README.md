# TypeRacer
### Tech Used:
- React
- Styled Components

### Learned
- Use useRef to provide a state value to eventListeners, because if you provide useState value, then it will only get the initial value. Any changes in state will not be updated in the event listener
- https://dev.to/marcostreng/how-to-really-remove-eventlisteners-in-react-3och
The removeEventListener(event, callback) function will internally do an equality check between the given callback and the callback which was passed to addEventListener(). If this check doesn't return true no listener will be removed from the window.

But we pass in the exact same function to addEventListener() and removeEventListener()! 🤯

Well,... not really.
As React renders the component new on every state change, it also assigns the function onKeyDown() new within each render. And that's why the equality check won't succeed.