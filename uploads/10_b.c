#include <sys/types.h>
#include <sys/wait.h>
#include <stdlib.h>
#include <stdio.h>
#include <errno.h>
#include <unistd.h>

int main() {
	
	int pid, status;

    int k = 1;
    int temp;
	printf("¬ведите число: ");
    scanf("%d", &temp);
    int tem = temp;

    pid = fork();

    if (pid == -1) {
		
		return EXIT_FAILURE;

	}
	
	if (!pid) {
		
		int res = 0;
		while (temp > 0) {
			temp = temp/10;
			k *= 10;
		} 
		
		while (k > 0) {
			res+= tem%10 * k;
			tem /= 10;
			k /= 10;
		}

		res /= 10
		printf("Reverse notation of the number: %d\n", (int)res );
		
		return 0;

    }
	
	else {
		
		printf("Parent is working \n");

		if (WIFEXITED(status)) {
			printf("Child terminated normally with exit code %i\n", WEXITSTATUS(status));
		}
    }

    return EXIT_SUCCESS;

}
