const callbackify = promise => (payload, callback) => 
  promise.then(res=>{
    callback(null,res)
  }).catch(e => callback(e))

const promise = new Promise((resolve,reject) => {
  setTimeout((res)=>resolve(10),1000)
})

const callbackifyedPromise = callbackify(promise)

const composeAsync = (...fns)=> function(...args) {
  let result = null;
  let err = null;
  try {
    console.log(fns[0].name, {args})
    fns[0](...args , (e, res) => {
      if(e) return err=e;
      return result = res;
		})
  } catch (e) {
    return err = e
  }
  function next() {
    if(result) {                            
      const [_,...tailFns] = fns                
      return tailFns !== undefined ?               
      composeAsync(...tailFns)(result):result                                    
    }
    if(err) console.log(err);
    if(result === null && err === null) {
      setTimeout(next, 0)
    }                                     
  }
  next()
}

function asyncFunc(time,fnc){
  return function (payload, callback){
    setTimeout(()=>fnc(payload, callback)
    ,time)
  }
}

const log = (payload,callback) => {
  callback(null,payload)
}

const increment = (payload, callback)=> {
  callback(null,payload+1)
}

const decrement = (payload, callback)=> {
  callback(null,payload-1)
}

composeAsync(
  callbackifyedPromise,
  log,
  asyncFunc(1000, increment), 
  log, 
  increment,
  asyncFunc(1000, decrement),
  log
)(1)


