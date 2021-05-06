


function sinT(x,y,t)
{
	let value = -2
	let epsilon = 10*(Math.sin(t/15)+0.5) * Math.abs(Math.cos(x/10+t))
	if(y < 100*Math.sin(x/10+t) + epsilon && y > 100*Math.sin(x/10+t) - epsilon)
	{	
		value = 1;
	}
	return value;
}

function quadratic(x,y,t)
{
	let value = -2
	let epsilon = Math.abs(2*Math.pow(x/20,1))
	if(y < Math.pow(x/20,2) + epsilon && y > Math.pow(x/20,2) - epsilon)
	{	
		value = 1;
	}
	return value;
}

function Integralof(f,n)
{
	return function(x)
	{
		eliminateSingularities = function(F,epsilon)
		{
			return function(A)
			{
				if(!isFinite(F(A)))
				{
					return F(A + epsilon)
				}
				return F(A)
			}
		}
		let h = x/n
		let value = 0
		
		for(let i = 0; i < n ; i ++)
		{
			let Sign = function(Number){if(Number < 0){return 1}return -1}(x)
			let Start = function(Number){if(Number === 0){return -1}return 1}(i)
			let Direction = Sign * Start
			let Epsilon = 1 * Direction
			let addValue = (h/2)*(eliminateSingularities(f,Epsilon)(i*h)+eliminateSingularities(f,Epsilon)((i+1)*h))
			//let addValue = (h/2)*(f(i*h)+f((i+1)*h))
			if(isFinite(addValue)){value += addValue}
		}
		return value
	}
}