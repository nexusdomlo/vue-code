export const randomCarId = ()=>{
	let carId= "";
	for(let i=0;i<8;i++){
		if((Math.ceil(Math.random()*9))>5)
		{
			carId+= Math.ceil(Math.random() * 9)
		}
		else{
			var ranNum= Math.ceil(Math.random() * 25)
			carId+=String.fromCharCode(65+ranNum)
		}
	}
	return carId;
}