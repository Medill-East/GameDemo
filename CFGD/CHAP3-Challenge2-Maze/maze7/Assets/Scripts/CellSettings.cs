using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class CellSettings : MonoBehaviour
{
    public TMP_Text indexText;

    public bool isCurrentRound = false;

    public bool isYin = false;

    public bool isLocked = false;

    // Start is called before the first frame update
    void Start()
    {

    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public void SetIndex(int input)
    {
        indexText.text = input.ToString();
    }

    public int GetIndex()
    {
        return int.Parse(indexText.text);
    }

    public void IsCurrentRound()
    {
        isCurrentRound = true;
        if (isLocked) return;

        indexText.fontStyle = FontStyles.Underline;
    }

    public void IsNotCurrentRound()
    {
        isCurrentRound = false;
        if (isLocked) return;

        indexText.fontStyle = FontStyles.Normal;
    }

    public void SwitchYinYang()
    {
        // yin to yang
        if (isYin) 
        {
            isYin = false;
            GetComponent<SpriteRenderer>().color = Color.white;
        }
        // yang to yin
        else
        {
            isYin = true;
            GetComponent<SpriteRenderer>().color = Color.black;
        }
    }

    public void OnCellClick()
    {
        if (!isLocked)
        {
            isLocked = true;
            indexText.fontStyle = FontStyles.Strikethrough | FontStyles.Italic;
            Debug.Log("lock cell " + indexText.text);
        }
        else
        {
            Debug.Log("cell already locked " + indexText.text);
        }
    }
}
