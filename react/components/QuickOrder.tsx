import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery } from "react-apollo";
import UPDATE_CART from "../graphql/updateCart.graphql"
import GET_PRODUCT from "../graphql/getProductBySku.graphql"
import styles from "./styles.css"

const QuickOrder = () => {
  const [inputText, setInputText] = useState("");
  const [search, setSearch] = useState("")

  const [getProductData, { data: product }] = useLazyQuery(GET_PRODUCT)
  const [addToCart] = useMutation(UPDATE_CART)

  const handleChange = (evt: any) => {
    setInputText(evt.target.value)
    console.log("input changed", inputText)
  }

  useEffect(() => {
    console.log("El resultado de mi producto es:", product, search)

    let skuId = parseInt(inputText)
    console.log("mis datos necesarios son:", skuId, product)
    addToCart({
      variables: {
        salesChannel: "1",
        items: [
          {
            id: skuId,
            quantity: 1,
            seller: "1"
          }
        ]
      }
    })
      .then(() => {
        window.location.href = "/checkout"
      })

  }, [product, search])

  const addProductToCart = () => {
    getProductData({
      variables: {
        sku: inputText
      }
    })
  }

  const searchProduct = (evt: any) => {
    evt.preventDefault();
    if (!inputText) {
      alert("Debes ingresar un producto")
    } else {
      console.log("al final estamos buscando:", inputText)
      setSearch(inputText)
      addProductToCart()

    }
  }

  return <div className={styles.container}>
    <h2 className={styles.title}>Compra rapida</h2>
    <form className={styles.form} onSubmit={searchProduct} >
      <div>
        <label htmlFor="sku">Ingresa el número de SKU: </label>
        <input className={styles.input} id="sku" type="text" onChange={handleChange}></input>
      </div>
      <input className={styles.button} type="submit" value="añadir al carrito" />
    </form>
  </div>
}

export default QuickOrder