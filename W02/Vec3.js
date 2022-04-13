class Vec3{
    constructor(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add( v ){
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    min(){
        var minimum = this.x
        if (this.y < minimum){
            var minimum = this.y;
        }
        if (this.z < minimum){
            var minimum = this.z;
        }
        return minimum;
    }

    mid(){
        if(this.x < this.y){
            if(this.x > this.z){
                return this.x;
            }
            else if(this.y < this.z){
                return this.y;
            }
            else{
                return this.z;
            }
        }
        else{
            if(this.y > this.z){
                return this.y
            }
            else if(this.x < this.z){
                return this.x;
            }
            else{
                return this.z;
            }
            
        }
    }


    max(){
        var maximum = this.x
        if (this.y > maximum){
            maximum = this.y;
        }
        if (this.z > maximum){
            maximum = this.z;
        }
        return maximum;
    }
    
}