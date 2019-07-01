/**
* https://tutorialedge.net/golang/golang-mysql-tutorial/
*/
package main
import "fmt"
import "database/sql"
import _ "github.com/go-sql-driver/mysql"

type User struct{
	ID int `json:"id"`
	Name string `json:"name"`
	SysUserId string `json:"sys_user_id"`
}

func main(){
	fmt.Println("mysql demo")

	db, err := sql.Open("mysql", "root:root@tcp(localhost:3308)/db1")
	defer db.Close()

	if err != nil {
		panic(err.Error())
	}

	results,err := db.Query("SELECT ID,NAME,SYS_USER_ID FROM bz_user")
	if err != nil {
		panic(err.Error())
	}

	for results.Next(){
		var user User
		err = results.Scan(&user.ID,&user.Name,&user.SysUserId)
		if err != nil {
			panic(err.Error())
		}
		
		//fmt.Println(user)
	}
}
