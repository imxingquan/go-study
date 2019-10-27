package main

import (
	"fmt"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

type User struct {
	ID    int
	Name  string
	Phone string
	Age   string
}

func (User) TableName() string {
	return "bz_user"
}

func main() {
	db, err := gorm.Open("mysql", "root:root@(127.0.0.1:3306)/bz8090?charset=utf8mb4&parseTime=True&loc=Local")
	if err != nil {
		panic("failed to connect database")
	}
	defer db.Close()
	db.LogMode(true)
	//db.AutoMigrate(&User{})
	gorm.DefaultTableNameHandler = func(db *gorm.DB, defaultTableName string) string {
		return "bz_" + defaultTableName
	}
	// var lst []User
	// db.Where("name LIKE ?", "%王%").Find(&lst)

	// fmt.Println(len(lst))

	var d1 User
	db.First(&d1)
	fmt.Println(d1)
}
