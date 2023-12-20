using UnityEngine;
using UnityEngine.UI;
using TMPro;
using System.Collections.Generic;
using System.Runtime.CompilerServices;

public class MazeGenerator : MonoBehaviour
{
    public float cellSize = 1.0f;

    private float offsetX;
    private float offsetY;

    public TMPro.TMP_InputField gridSizeInput;
    public TMPro.TMP_Text roundText;
    public GameObject blackCellPrefab;
    public GameObject whiteCellPrefab;
    public List<GameObject> cells;
    public Camera mainCamera; // Reference to the Camera component

    public GameObject rule;

    public float resultCellSize = 0.5f;
    public GameObject clickedCellsObject;
    public Transform clickedCellsTrans; // Assign the container transform in the Inspector

    public List<GameObject> clickedCells;
    public List<int> clickedCellsCode;


    private int gridSize = 1;
    private int currentRound = 0;
    private int nextRound = 1;
    private int currentRow = 0;
    private bool isOddSize = false;
    private int index = 0;

    private GameObject cell;
    private CellSettings cellSettings;
    private GameObject aboveCell;
    private CellSettings aboveCellSettings;

    private void Start()
    {
        mainCamera = Camera.main;
        //rule.SetActive(false);
    }

    public void GenerateMaze()
    {
        // Clear existing grid
        ClearGrid();
        gridSize = int.Parse(gridSizeInput.text);

        offsetX = -0.5f * (gridSize - 1) * cellSize;
        offsetY = -0.5f * (gridSize - 1) * cellSize;

        int cellIndex = 1;

        for (int j = 0; j < gridSize; j++)
        {
            for (int i = 0; i < gridSize; i++)
            {
                GameObject cell;

                if (Random.Range(0, 2) == 0)
                {
                    cell = Instantiate(blackCellPrefab);
                }
                else
                {
                    cell = Instantiate(whiteCellPrefab);
                }

                cell.transform.parent = transform;
                cell.transform.position = new Vector3(i * cellSize + offsetX, j * cellSize + offsetY, 0);

                cellSettings = cell.GetComponent<CellSettings>();
                cellSettings.SetIndex(cellIndex);

                cells.Add(cell);

                cellIndex++;
            }
        }

        // Adjust camera orthographic size based on gridSize
        float cameraSize = Mathf.Max(gridSize, gridSize) * 0.55f; // Adjust the multiplier as needed
        mainCamera.orthographicSize = cameraSize;

        rule.transform.localScale = new Vector3 (gridSize/16f, gridSize/16f, gridSize/16f);
    }


    private void ClearGrid()
    {
        ClearRound();
        cells.Clear();
        // Destroy all child objects (existing grid)
        foreach (Transform child in transform)
        {
            Destroy(child.gameObject);
        }
    }

    private void DestroyObjectsAndChildren(GameObject givenObject)
    {
        foreach (Transform child in givenObject.transform)
        {
            DestroyObjectsAndChildren(child.gameObject);
        }

        Destroy(givenObject);
    }


    public void NextRound()
    {
        roundText.text = nextRound.ToString();

        Debug.Log("is odd size" + gridSize % 2);
        Debug.Log("before update, currentRound " + currentRound);
        Debug.Log("before update, nextRound " + nextRound);

        if (currentRound >= 1)
        {
            UpdateCellBasedOnRules();
        }
        UpdateCellIndex();

        currentRound = nextRound;
        nextRound++;

        Debug.Log("after update, currentRound " + currentRound);
        Debug.Log("after update, currentRound " + nextRound);
    }

    public void ClearRound()
    {
        currentRound = 0;
        nextRound = 1;
        roundText.text = currentRound.ToString();

        foreach (GameObject cell in cells)
        {
            cellSettings = cell.GetComponent<CellSettings>();
            cellSettings.IsNotCurrentRound();
        }

        ClearClickedCells();
    }

    public void UpdateCellIndex()
    {
        isOddSize = gridSize % 2 == 1;

        foreach (GameObject cell in cells)
        {
            cellSettings = cell.GetComponent<CellSettings>();
            bool isHighlightedLine = false;
            GetIndexAndCurrentRow();

            // odd round, odd lines
            if ((nextRound % 2 == 1 && currentRow % 2 == 1)
                // even round, even lines
                || (nextRound % 2 == 0 && currentRow % 2 == 0))
            {
                isHighlightedLine = true;
            }
            else
            {
                isHighlightedLine = false;
            }

            if (isHighlightedLine)
            {
                cellSettings.IsCurrentRound();
                Debug.Log("Cell highlighted: " + cellSettings.indexText.text);
            }
            else
            {
                cellSettings.IsNotCurrentRound();
                Debug.Log("Cell normal: " + cellSettings.indexText.text);
            }
        }
    }

    public void GetIndexAndCurrentRow()
    {
        index = int.Parse(cellSettings.indexText.text);
        currentRow = 1 + (index - 1) / gridSize;
    }

    public void UpdateCellBasedOnRules()
    {
        Debug.Log("Update cell based on rules");
        foreach (GameObject cell in cells)
        {
            cellSettings = cell.GetComponent<CellSettings>();
            GetIndexAndCurrentRow();

            // Check if the cell is locked
            if (cellSettings.isLocked)
            {
                continue; // Skip processing locked cells
            }
            else
            {
                // if top row, ignore it
                if (currentRow == gridSize)
                {

                }
                else
                {
                    // if is target cell
                    if (cellSettings.isCurrentRound)
                    {
                        aboveCell = GetAboveCell(cellSettings.GetIndex());
                        aboveCellSettings = aboveCell.GetComponent<CellSettings>();
                        int aboveIndex = aboveCellSettings.GetIndex();

                        //少阴->老阴，即下黑上白变为下黑上黑
                        if (cellSettings.isYin && !aboveCellSettings.isYin)
                        {
                            // if above cell is not locked
                            if (!aboveCellSettings.isLocked)
                            {
                                // above white -> above black
                                Debug.Log("current index " + cellSettings.GetIndex());
                                Debug.Log("above white -> above black");

                                aboveCellSettings.SwitchYinYang();
                                continue;
                            }
                        }
                        //老阴->少阳，即下黑上黑变为下白上黑
                        else if (cellSettings.isYin && aboveCellSettings.isYin)
                        {
                            // current black -> current white
                            Debug.Log("current index " + cellSettings.GetIndex());

                            Debug.Log("current black -> current white");

                            cellSettings.SwitchYinYang();
                            continue;

                        }
                        //少阳->老阳，即下白上黑变为下白上白
                        else if (!cellSettings.isYin && aboveCellSettings.isYin)
                        {
                            // if above cell is not locked
                            if (!aboveCellSettings.isLocked)
                            {
                                // above black -> above white
                                Debug.Log("current index " + cellSettings.GetIndex());

                                Debug.Log("above black -> above white");

                                aboveCellSettings.SwitchYinYang();
                                continue;
                            }
                        }
                        //老阳->少阴，即下白上白变为下黑上白
                        else if (!cellSettings.isYin && !aboveCellSettings.isYin)
                        {
                            // current white -> current black
                            Debug.Log("current index " + cellSettings.GetIndex());

                            Debug.Log("current white -> current black");

                            cellSettings.SwitchYinYang();
                            continue;

                        }
                    }
                }
            }
        }
    }

    private GameObject GetAboveCell(int givenIndex)
    {
        foreach (GameObject cell in cells)
        {
            if (cell.GetComponent<CellSettings>().GetIndex() == givenIndex + gridSize)
            {
                aboveCell = cell;
            }
        }

        return aboveCell;
    }

    // Inside the ShowClickedCells method
    public void ShowClickedCells()
    {
        Transform parentTransform = GameObject.FindGameObjectWithTag("ClickedCells").transform;
        foreach (var clickedCell in clickedCells)
        {
            if (clickedCell.GetComponent<CellSettings>().isShowed == false)
            {
                // Instantiate a new representation for each clicked cell
                GameObject clickedResult = Instantiate(clickedCell);
                clickedResult.transform.SetParent(parentTransform);
                
                clickedResult.transform.localScale = new Vector3(resultCellSize, resultCellSize, resultCellSize);
                Vector3 newPosition = new Vector3(
                    (gridSize + 1) * 0.5f,
                    resultCellSize * (cellSize * (clickedCells.IndexOf(clickedCell))) + offsetY,
                    0);
                clickedResult.transform.position = newPosition;

                clickedCell.GetComponent<CellSettings>().isShowed = true;
            }
            
        }
    }

    public void ClearClickedCells()
    {
        clickedCells.Clear();
        clickedCellsCode.Clear();

        foreach (Transform cell in clickedCellsTrans)
        {
            Destroy(cell.gameObject);
        }
    }

    public void ToggleRule()
    {
        if (rule.activeInHierarchy)
        {
            rule.SetActive(false);
        }
        else 
        {
            rule.SetActive(true);
        }
    }    
}
