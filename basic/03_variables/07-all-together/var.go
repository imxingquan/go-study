package main
import "fmt"

var a = "this is stored in the 变量 a"
var b,c string = "存储在B中","stored in c"
var d string

func main(){
    d = "stored in d"
    var e = 42 //函数作用域
    f := 43
    g := "stored in g"
    h, i := "stored in h","stored in i"
    j,k,l,m := 44.7,true,false,'m'
    n := "n"
    o := 'o'

    fmt.Println("a-",a)
    fmt.Println("b-",b)
    fmt.Println("c-",c)
    fmt.Println("d-",d)
    fmt.Println("e-",e)
    fmt.Println("f-",f)
    fmt.Println("g-",g)
    fmt.Println("h-",h)
    fmt.Println("i-",i)
    fmt.Println("j-",j)
    fmt.Println("k-",k)
    fmt.Println("l-",l)
    fmt.Println("m-",m)
    fmt.Println("n-",n)
    fmt.Println("o-",o)

}

/* output
a- this is stored in the 变量 a
b- 存储在B中
c- stored in c
d- stored in d
e- 42
f- 43
g- stored in g
h- stored in h
i- stored in i
j- 44.7
k- true
l- false
m- 109
n- n
o- 111
*/